'use client';

import { useEffect, useState, type KeyboardEvent } from 'react';

import { site } from '@/data/site';
import { detectLang, formatDayMonth } from '@/lib/format';
import { compareNotes } from '@/lib/note-order';

const TOKEN_KEY = 'site:note-token';
const API = 'https://api.github.com';

/** How many notes a reader sees before the list has to be opened up. */
const VISIBLE_LIMIT = 5;

/** A field note as it reaches the browser from the built page. */
export interface FieldNote {
  slug: string;
  date: string;
  pinned: boolean;
  /** Rendered HTML, for notes that came from the built page. */
  html: string;
  /** 'zh' when the note is written in Chinese. */
  lang?: string;
}

/** A row in the list: either the built version, or one changed this session. */
interface Row {
  slug: string;
  date: string;
  pinned: boolean;
  /** Rendered HTML, for notes that came from the built page. */
  html?: string;
  /** Raw text, for notes just written or edited here. */
  text?: string;
  /** 'zh' when the note is written in Chinese. */
  lang?: string;
  /** A quiet line under a note that is waiting for the next build. */
  pendingNote?: string;
}

/** The note currently open for editing. */
interface Editing {
  slug: string;
  /** The blob sha the edit is based on; GitHub needs it to accept the write. */
  sha: string;
  date: string;
  pinned: boolean;
}

interface Message {
  tone: 'ok' | 'error' | 'info';
  text: string;
}

function pathFor(slug: string): string {
  return `${site.editor.notesDir}/${slug}.md`;
}

/** Today's date in the author's own time zone, as YYYY-MM-DD. */
function todayIso(): string {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: site.timeZone || 'UTC',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

function noteFile(date: string, body: string, pinned = false): string {
  const flags = [`date: '${date}'`, ...(pinned ? ['pinned: true'] : [])];
  return `---\n${flags.join('\n')}\n---\n\n${body.trim()}\n`;
}

function splitFrontmatter(text: string): { date: string; pinned: boolean; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text);
  if (!match) return { date: '', pinned: false, body: text.trim() };

  const date = /^date:\s*['"]?([^'"\n]+)['"]?\s*$/m.exec(match[1])?.[1]?.trim() ?? '';
  const pinned = /^pinned:\s*true\s*$/m.test(match[1]);
  return { date, pinned, body: text.slice(match[0].length).trim() };
}

/**
 * Base64 of a UTF-8 string.
 *
 * `window.btoa` only accepts Latin-1, so 中文 would throw on it — the text is
 * encoded to bytes first and each byte sent through separately. This is what
 * lets a note be written in Chinese, or in any other script.
 */
function toBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return window.btoa(binary);
}

/** The reverse: bytes out of base64, then decoded as UTF-8. */
function fromBase64(text: string): string {
  const binary = window.atob(text.replace(/\s/g, ''));
  return new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)));
}

function explain(status: number, repo: string): string {
  switch (status) {
    case 401:
      return 'GitHub refused that token (401). Check it for typos, or make a new one.';
    case 403:
      return 'That token cannot write to this repository (403). Give it Contents: read and write.';
    case 404:
      return `GitHub could not find ${repo} with this token (404). Check the repository name, and the token's repository access.`;
    case 409:
      return 'The file changed in the repository since this page was built (409). Reload the page and try again.';
    case 422:
      return 'GitHub rejected that (422). A note cannot be empty.';
    default:
      return `GitHub returned an error (${status}).`;
  }
}

/** The blob sha a write produced, if GitHub sent one back. */
function readBlobSha(result: Record<string, unknown> | null): string | undefined {
  const content = result?.content as { sha?: unknown } | undefined;
  return typeof content?.sha === 'string' ? content.sha : undefined;
}

async function gh(path: string, token: string, init: RequestInit = {}) {
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
    },
  });

  if (!response.ok) throw new Error(explain(response.status, site.editor.repo));
  if (response.status === 204) return null;
  return (await response.json()) as Record<string, unknown>;
}

/** Read one note straight from the repository, so edits never work from stale text. */
async function readNote(
  slug: string,
  token: string,
): Promise<{ sha: string; date: string; pinned: boolean; body: string }> {
  const data = await gh(
    `/repos/${site.editor.repo}/contents/${pathFor(slug)}?ref=${encodeURIComponent(site.editor.branch)}`,
    token,
  );
  const text = typeof data?.content === 'string' ? fromBase64(data.content) : '';
  const { date, pinned, body } = splitFrontmatter(text);
  return { sha: String(data?.sha ?? ''), date, pinned, body };
}

/**
 * The field notes list, plus the small box at its end that only its author can
 * use.
 *
 * A note is a file in the repository, so writing one takes a credential rather
 * than a password kept in this page: a GitHub token, stored in this browser
 * alone, that commits to content/notes/. The site rebuilds itself from the
 * commit a minute later.
 *
 * · Readers see the five most recent notes, and no controls at all.
 * · Unlocked, a note is something you click: it opens where it stands, with
 *   save, cancel, pin and delete on the panel underneath.
 * · New notes are written in the box at the end of the list, filed under
 *   today, and can be written in any language.
 * · Unlock once and this browser remembers; "Forget this token" puts it back.
 */
export function FieldNoteComposer({ notes }: { notes: FieldNote[] }) {
  const { repo, branch } = site.editor;

  const [rows, setRows] = useState<Row[]>(() => [...notes].sort(compareNotes));
  const [token, setToken] = useState('');
  const [tokenInput, setTokenInput] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [newDraft, setNewDraft] = useState('');
  const [editing, setEditing] = useState<Editing | null>(null);
  const [editDraft, setEditDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [today, setToday] = useState('');

  // Both of these are browser-only facts, so they arrive after the first paint
  // rather than during the build (which would date the page to the wrong day).
  useEffect(() => {
    setToday(todayIso());
    try {
      const stored = window.localStorage.getItem(TOKEN_KEY);
      if (stored) setToken(stored);
    } catch {
      /* private mode, no storage — the box simply stays locked */
    }
  }, []);

  if (!repo) return null;

  const unlocked = Boolean(token);
  const pinnedCount = rows.filter((row) => row.pinned).length;
  const collapsible = rows.length > VISIBLE_LIMIT;
  const shown = expanded || !collapsible ? rows : rows.slice(0, VISIBLE_LIMIT);
  const hidden = rows.length - shown.length;

  /** Every change to the list goes through here, so the order always holds. */
  const sorted = (next: Row[]) => [...next].sort(compareNotes);

  const unlock = async () => {
    const value = tokenInput.trim();
    if (!value) return;

    setBusy(true);
    setMessage(null);

    try {
      const data = await gh(`/repos/${repo}`, value);

      if (data?.permissions && (data.permissions as { push?: boolean }).push === false) {
        setMessage({
          tone: 'error',
          text: 'That token can read the repository but not write to it. Give it Contents: read and write.',
        });
        return;
      }

      setToken(value);
      setTokenInput('');
      try {
        window.localStorage.setItem(TOKEN_KEY, value);
      } catch {
        /* not fatal: the token just will not be remembered */
      }
      setMessage({
        tone: 'ok',
        text: 'Unlocked. Click any note to edit it; new ones go in the box below.',
      });
    } catch (error) {
      setMessage({ tone: 'error', text: (error as Error).message });
    } finally {
      setBusy(false);
    }
  };

  const forget = () => {
    setToken('');
    setEditing(null);
    setEditDraft('');
    try {
      window.localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* nothing to clean up */
    }
    setMessage({
      tone: 'info',
      text: 'Token forgotten. This browser can read the notes, but no longer write them.',
    });
  };

  /** Notes are filed under today, with -2, -3 … if that day already has one. */
  const nextSlug = (date: string) => {
    const taken = new Set(rows.map((row) => row.slug));
    if (!taken.has(date)) return date;
    let index = 2;
    while (taken.has(`${date}-${index}`)) index += 1;
    return `${date}-${index}`;
  };

  const saveNew = async () => {
    const body = newDraft.trim();
    if (!body || busy) return;

    const date = today || todayIso();
    const slug = nextSlug(date);
    setBusy(true);
    setMessage(null);

    try {
      await gh(`/repos/${repo}/contents/${pathFor(slug)}`, token, {
        method: 'PUT',
        body: JSON.stringify({
          message: `Field note: ${formatDayMonth(date)}`,
          content: toBase64(noteFile(date, body)),
          branch,
        }),
      });

      setRows((previous) =>
        sorted([
          {
            slug,
            date,
            pinned: false,
            text: body,
            lang: detectLang(body),
            pendingNote: 'Committed — it appears here, rendered, after the next build.',
          },
          ...previous,
        ]),
      );
      setNewDraft('');
      setMessage({
        tone: 'ok',
        text: `Saved as content/notes/${slug}.md. GitHub Pages rebuilds in about a minute.`,
      });
    } catch (error) {
      setMessage({ tone: 'error', text: (error as Error).message });
    } finally {
      setBusy(false);
    }
  };

  /** Clicking a note opens it in place. The text comes from the repository. */
  const beginEdit = async (row: Row) => {
    if (busy || !unlocked) return;

    setBusy(true);
    setMessage(null);

    try {
      const note = await readNote(row.slug, token);
      setEditing({
        slug: row.slug,
        sha: note.sha,
        date: note.date || row.date,
        pinned: note.pinned,
      });
      setEditDraft(note.body);
    } catch (error) {
      setMessage({ tone: 'error', text: (error as Error).message });
    } finally {
      setBusy(false);
    }
  };

  const closeEditor = () => {
    setEditing(null);
    setEditDraft('');
  };

  const saveEdit = async () => {
    const body = editDraft.trim();
    if (!editing || !body || busy) return;

    setBusy(true);
    setMessage(null);

    try {
      await gh(`/repos/${repo}/contents/${pathFor(editing.slug)}`, token, {
        method: 'PUT',
        body: JSON.stringify({
          message: `Edit field note: ${editing.slug}`,
          // The date is kept as it was — editing a note does not move it to today.
          content: toBase64(noteFile(editing.date || today || todayIso(), body, editing.pinned)),
          sha: editing.sha,
          branch,
        }),
      });

      const { slug, pinned } = editing;
      setRows((previous) =>
        previous.map((row) =>
          row.slug === slug
            ? {
                ...row,
                pinned,
                text: body,
                html: undefined,
                lang: detectLang(body),
                pendingNote: 'Edited — the rendered version returns with the next build.',
              }
            : row,
        ),
      );
      closeEditor();
      setMessage({ tone: 'ok', text: 'Saved. GitHub Pages rebuilds in about a minute.' });
    } catch (error) {
      setMessage({ tone: 'error', text: (error as Error).message });
    } finally {
      setBusy(false);
    }
  };

  /**
   * Pin or unpin: the same file rewrite, with one extra line of frontmatter.
   *
   * If the note is open and has unsaved text, that text goes in too — pinning
   * should never quietly throw away what you have just typed.
   */
  const setPinned = async (
    target: { slug: string; date: string },
    next: boolean,
    draft?: string,
  ) => {
    if (busy) return;

    setBusy(true);
    setMessage(null);

    try {
      const note = await readNote(target.slug, token);
      const body = draft?.trim() || note.body;

      const result = await gh(`/repos/${repo}/contents/${pathFor(target.slug)}`, token, {
        method: 'PUT',
        body: JSON.stringify({
          message: `${next ? 'Pin' : 'Unpin'} field note: ${target.slug}`,
          content: toBase64(noteFile(note.date || target.date, body, next)),
          sha: note.sha,
          branch,
        }),
      });

      setRows((previous) =>
        sorted(
          previous.map((item) =>
            item.slug === target.slug
              ? {
                  ...item,
                  pinned: next,
                  ...(draft === undefined
                    ? {}
                    : {
                        text: body,
                        html: undefined,
                        lang: detectLang(body),
                        pendingNote: 'Edited — the rendered version returns with the next build.',
                      }),
                }
              : item,
          ),
        ),
      );
      // The write made a new blob, so an open editor's sha is stale now;
      // saving from it again would come back as a 409 without this.
      setEditing((current) =>
        current && current.slug === target.slug
          ? { ...current, pinned: next, sha: readBlobSha(result) ?? current.sha }
          : current,
      );
      setMessage({
        tone: 'ok',
        text: next
          ? 'Pinned to the top. It stays there until you unpin it.'
          : 'Unpinned — it falls back into date order.',
      });
    } catch (error) {
      setMessage({ tone: 'error', text: (error as Error).message });
    } finally {
      setBusy(false);
    }
  };

  const remove = async (row: { slug: string; date: string }) => {
    if (busy) return;
    const label = formatDayMonth(row.date);
    if (
      !window.confirm(
        `Delete the note from ${label}? It is removed from the repository with a commit.`,
      )
    ) {
      return;
    }

    setBusy(true);
    setMessage(null);

    try {
      const note = await readNote(row.slug, token);
      await gh(`/repos/${repo}/contents/${pathFor(row.slug)}`, token, {
        method: 'DELETE',
        body: JSON.stringify({ message: `Delete field note: ${row.slug}`, sha: note.sha, branch }),
      });

      setRows((previous) => previous.filter((item) => item.slug !== row.slug));
      if (editing?.slug === row.slug) closeEditor();
      setMessage({ tone: 'ok', text: 'Deleted. GitHub Pages rebuilds in about a minute.' });
    } catch (error) {
      setMessage({ tone: 'error', text: (error as Error).message });
    } finally {
      setBusy(false);
    }
  };

  const onBodyKey = (event: KeyboardEvent<HTMLDivElement>, row: Row) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    void beginEdit(row);
  };

  return (
    <>
      {rows.length > 0 ? (
        <p className="field-notes__count meta">
          {rows.length} {rows.length === 1 ? 'note' : 'notes'}
          <span className="dot-sep">·</span>
          {pinnedCount > 0 ? `${pinnedCount} pinned` : 'Newest first'}
        </p>
      ) : null}

      {rows.length > 0 ? (
        <ol className={`field-notes${expanded && collapsible ? ' field-notes--expanded' : ''}`}>
          {shown.map((row) => {
            // Narrowed here so the open panel can read the note's own state.
            const current = editing && editing.slug === row.slug ? editing : null;

            return (
              <li
                key={row.slug}
                className={`field-notes__item${row.pendingNote ? ' field-notes__item--fresh' : ''}${
                  row.pinned ? ' field-notes__item--pinned' : ''
                }`}
              >
                <div className="field-notes__head">
                  <p className="field-notes__date meta">
                    {formatDayMonth(row.date)}
                    {row.pinned ? (
                      <>
                        <span className="dot-sep">·</span>
                        <span className="field-notes__pin">Pinned</span>
                      </>
                    ) : null}
                    {unlocked && !current ? (
                      <>
                        <span className="dot-sep">·</span>
                        <span className="field-notes__hint">Click to edit</span>
                      </>
                    ) : null}
                  </p>
                </div>

                {current ? (
                  /* ------------------------------------------------- open note -- */
                  <div className="note-panel note-panel--inline">
                    <p className="note-panel__lede">
                      <span className="note-panel__date">{formatDayMonth(current.date)}</span>
                      <span className="meta">
                        The date stays as it is. Write in English or 中文 — both are fine.
                      </span>
                    </p>

                    <label className="visually-hidden" htmlFor={`note-edit-${row.slug}`}>
                      Edit this field note
                    </label>
                    <textarea
                      id={`note-edit-${row.slug}`}
                      className="note-panel__input"
                      rows={5}
                      value={editDraft}
                      disabled={busy}
                      autoFocus
                      onChange={(event) => setEditDraft(event.target.value)}
                    />

                    <div className="note-panel__row">
                      <button
                        type="button"
                        className="btn btn--primary"
                        disabled={busy || !editDraft.trim()}
                        onClick={() => void saveEdit()}
                      >
                        {busy ? 'Saving…' : 'Save changes'}
                      </button>
                      <button
                        type="button"
                        className="btn"
                        disabled={busy}
                        onClick={() => void setPinned(current, !current.pinned, editDraft)}
                      >
                        {current.pinned ? 'Unpin' : 'Pin to top'}
                      </button>
                      <button
                        type="button"
                        className="btn"
                        disabled={busy}
                        onClick={closeEditor}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn--danger"
                        disabled={busy}
                        onClick={() => void remove(row)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ------------------------------------------------- shut note -- */
                  <div
                    className={`field-notes__target${unlocked ? ' field-notes__target--live' : ''}`}
                    {...(unlocked
                      ? {
                          role: 'button',
                          tabIndex: 0,
                          'aria-label': `Edit the note from ${formatDayMonth(row.date)}`,
                          onClick: () => void beginEdit(row),
                          onKeyDown: (event: KeyboardEvent<HTMLDivElement>) =>
                            onBodyKey(event, row),
                        }
                      : {})}
                  >
                    {row.html ? (
                      <div
                        className="field-notes__body prose"
                        {...(row.lang ? { lang: row.lang } : {})}
                        dangerouslySetInnerHTML={{ __html: row.html }}
                      />
                    ) : (
                      <div
                        className="field-notes__body prose field-notes__body--raw"
                        {...(row.lang ? { lang: row.lang } : {})}
                      >
                        {row.text}
                      </div>
                    )}

                    {unlocked ? (
                      <span className="field-notes__cue" aria-hidden="true">
                        ✎
                      </span>
                    ) : null}
                  </div>
                )}

                {row.pendingNote ? <p className="field-notes__pending meta">{row.pendingNote}</p> : null}
              </li>
            );
          })}
        </ol>
      ) : (
        <div className="empty-state">
          No field notes yet. Add a Markdown file to <code>content/notes/</code> — or write one from
          the box below.
        </div>
      )}

      {collapsible ? (
        <p className="field-notes__more">
          <button
            type="button"
            className="note-link note-link--more"
            aria-expanded={expanded}
            onClick={() => setExpanded((open) => !open)}
          >
            {expanded ? 'Show the five most recent' : `Show all ${rows.length} notes`}
          </button>
          {!expanded && hidden > 0 ? (
            <span className="meta">
              <span className="dot-sep">·</span>
              {hidden} older {hidden === 1 ? 'note' : 'notes'}
            </span>
          ) : null}
        </p>
      ) : null}

      {/* --------------------------------------------------------- the desk -- */}

      <div className="note-desk">
        <button
          type="button"
          className="note-desk__toggle"
          aria-expanded={panelOpen}
          onClick={() => setPanelOpen((open) => !open)}
        >
          ✎ A note to myself
        </button>

        {panelOpen ? (
          <div className="note-panel">
            {unlocked ? (
              <>
                <p className="note-panel__lede">
                  <span className="note-panel__date">{today ? formatDayMonth(today) : 'Today'}</span>
                  <span className="meta">
                    Filed under today. English or 中文, one observation at a time.
                  </span>
                </p>

                <label className="visually-hidden" htmlFor="note-new">
                  A new field note
                </label>
                <textarea
                  id="note-new"
                  className="note-panel__input"
                  rows={4}
                  value={newDraft}
                  disabled={busy}
                  placeholder="A cleaner told me that the fastest part of cleaning a room is not the cleaning…"
                  onChange={(event) => setNewDraft(event.target.value)}
                />
                <p className="note-panel__fine">
                  Saved straight into the repository. To pin it or change a word, click the note
                  itself — it opens in place.
                </p>

                <div className="note-panel__row">
                  <button
                    type="button"
                    className="btn btn--primary"
                    disabled={busy || !newDraft.trim()}
                    onClick={() => void saveNew()}
                  >
                    {busy ? 'Saving…' : 'Save note'}
                  </button>
                  <button type="button" className="btn btn--quiet" disabled={busy} onClick={forget}>
                    Forget this token
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="note-panel__lede">
                  These notes are files in the repository, so writing one needs a credential rather than a
                  password kept in this page: a GitHub token with <em>Contents: read and write</em> on{' '}
                  <code>{repo}</code>. It is stored in this browser alone, and sent to github.com — nowhere
                  else.
                </p>

                <div className="note-panel__row">
                  <label className="visually-hidden" htmlFor="note-token">
                    GitHub token
                  </label>
                  <input
                    id="note-token"
                    type="password"
                    className="note-panel__input"
                    value={tokenInput}
                    disabled={busy}
                    placeholder="Fine-grained token"
                    autoComplete="off"
                    onChange={(event) => setTokenInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') void unlock();
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn--primary"
                    disabled={busy || !tokenInput.trim()}
                    onClick={() => void unlock()}
                  >
                    {busy ? 'Checking…' : 'Unlock'}
                  </button>
                </div>

                <p className="note-panel__fine">
                  Make it fine-grained, limited to this one repository, with an expiry. While it is unlocked,
                  anyone using this browser profile can write too — so avoid unlocking on a shared machine.
                  Readers never see this box unlocked, and never see any controls on the notes themselves.
                </p>
              </>
            )}
          </div>
        ) : null}

        {message ? (
          <p className={`note-panel__message note-panel__message--${message.tone}`} role="status">
            {message.text}
          </p>
        ) : null}
      </div>
    </>
  );
}
