'use client';

import { useEffect, useState } from 'react';

import { site } from '@/data/site';
import { formatDayMonth } from '@/lib/format';

const TOKEN_KEY = 'site:note-token';
const API = 'https://api.github.com';

/** A field note as it reaches the browser from the built page. */
export interface FieldNote {
  slug: string;
  date: string;
  body: string;
  html: string;
}

/** A row in the list: either the built version, or one changed this session. */
interface Row {
  slug: string;
  date: string;
  /** Rendered HTML, for notes that came from the built page. */
  html?: string;
  /** Raw text, for notes just written or edited here. */
  text?: string;
  /** A quiet line under a note that is waiting for the next build. */
  pendingNote?: string;
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

function noteFile(date: string, body: string): string {
  return `---\ndate: '${date}'\n---\n\n${body.trim()}\n`;
}

function splitFrontmatter(text: string): { date: string; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text);
  if (!match) return { date: '', body: text.trim() };

  const date = /^date:\s*['"]?([^'"\n]+)['"]?\s*$/m.exec(match[1])?.[1]?.trim() ?? '';
  return { date, body: text.slice(match[0].length).trim() };
}

function toBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return window.btoa(binary);
}

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
): Promise<{ sha: string; date: string; body: string }> {
  const data = await gh(
    `/repos/${site.editor.repo}/contents/${pathFor(slug)}?ref=${encodeURIComponent(site.editor.branch)}`,
    token,
  );
  const text = typeof data?.content === 'string' ? fromBase64(data.content) : '';
  const { date, body } = splitFrontmatter(text);
  return { sha: String(data?.sha ?? ''), date, body };
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
 * · Readers see the notes, and a box that asks for a token they do not have.
 * · Unlock once and this browser remembers; "Forget this token" puts it back.
 * · Dates come from the clock, so a note is never filed under the wrong day.
 */
export function FieldNoteComposer({ notes }: { notes: FieldNote[] }) {
  const { repo, branch } = site.editor;

  const [rows, setRows] = useState<Row[]>(() =>
    notes.map((note) => ({ slug: note.slug, date: note.date, html: note.html })),
  );
  const [token, setToken] = useState('');
  const [tokenInput, setTokenInput] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [newDraft, setNewDraft] = useState('');
  const [editing, setEditing] = useState<{ slug: string; sha: string; date: string } | null>(null);
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
      setMessage({ tone: 'ok', text: 'Unlocked. Notes you save here go into the repository.' });
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

      setRows((previous) => [
        {
          slug,
          date,
          text: body,
          pendingNote: 'Committed — it appears here, rendered, after the next build.',
        },
        ...previous,
      ]);
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

  const startEdit = async (row: Row) => {
    if (busy) return;

    setBusy(true);
    setMessage(null);

    try {
      const note = await readNote(row.slug, token);
      setEditing({ slug: row.slug, sha: note.sha, date: note.date || row.date });
      setEditDraft(note.body);
      setMessage({ tone: 'info', text: 'Loaded the latest version from the repository.' });
    } catch (error) {
      setMessage({ tone: 'error', text: (error as Error).message });
    } finally {
      setBusy(false);
    }
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
          content: toBase64(noteFile(editing.date || today || todayIso(), body)),
          sha: editing.sha,
          branch,
        }),
      });

      const slug = editing.slug;
      setRows((previous) =>
        previous.map((row) =>
          row.slug === slug
            ? {
                ...row,
                text: body,
                html: undefined,
                pendingNote: 'Edited — the rendered version returns with the next build.',
              }
            : row,
        ),
      );
      setEditing(null);
      setEditDraft('');
      setMessage({ tone: 'ok', text: 'Saved. GitHub Pages rebuilds in about a minute.' });
    } catch (error) {
      setMessage({ tone: 'error', text: (error as Error).message });
    } finally {
      setBusy(false);
    }
  };

  const remove = async (row: Row) => {
    if (busy) return;
    const label = formatDayMonth(row.date);
    if (!window.confirm(`Delete the note from ${label}? It is removed from the repository with a commit.`)) {
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
      if (editing?.slug === row.slug) {
        setEditing(null);
        setEditDraft('');
      }
      setMessage({ tone: 'ok', text: 'Deleted. GitHub Pages rebuilds in about a minute.' });
    } catch (error) {
      setMessage({ tone: 'error', text: (error as Error).message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {rows.length > 0 ? (
        <ol className="field-notes">
          {rows.map((row) => (
            <li
              key={row.slug}
              className={`field-notes__item${row.pendingNote ? ' field-notes__item--fresh' : ''}`}
            >
              <div className="field-notes__head">
                <p className="field-notes__date meta">{formatDayMonth(row.date)}</p>

                {unlocked ? (
                  <p className="field-notes__actions">
                    <button
                      type="button"
                      className="note-link"
                      disabled={busy}
                      onClick={() => void startEdit(row)}
                    >
                      Edit
                    </button>
                    <span className="dot-sep">·</span>
                    <button
                      type="button"
                      className="note-link note-link--danger"
                      disabled={busy}
                      onClick={() => void remove(row)}
                    >
                      Delete
                    </button>
                  </p>
                ) : null}
              </div>

              {editing?.slug === row.slug ? (
                <div className="note-panel note-panel--inline">
                  <label className="visually-hidden" htmlFor="note-edit">
                    Edit this field note
                  </label>
                  <textarea
                    id="note-edit"
                    className="note-panel__input"
                    rows={4}
                    value={editDraft}
                    disabled={busy}
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
                      onClick={() => {
                        setEditing(null);
                        setEditDraft('');
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : row.html ? (
                <div className="field-notes__body prose" dangerouslySetInnerHTML={{ __html: row.html }} />
              ) : (
                <div className="field-notes__body prose field-notes__body--raw">{row.text}</div>
              )}

              {row.pendingNote ? <p className="field-notes__pending meta">{row.pendingNote}</p> : null}
            </li>
          ))}
        </ol>
      ) : (
        <div className="empty-state">
          No field notes yet. Add a Markdown file to <code>content/notes/</code> — or write one from the box
          below.
        </div>
      )}

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
                  <span className="meta">Filed under today. One observation, 50–150 words.</span>
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
                  Readers never see this box unlocked, and never see the controls above the notes.
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
