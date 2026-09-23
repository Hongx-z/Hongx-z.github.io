'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { site } from '@/data/site';
import { withBase } from '@/lib/base';

const STORAGE_KEY = 'sound-preference';

type SoundState = 'off' | 'playing' | 'waiting';

/**
 * Background music toggle.
 *
 * Renders nothing at all until `site.audio.url` is set. When set, a small
 * fixed "Sound" control appears bottom-right. Music never starts by itself:
 * the reader opts in, the preference is remembered, and on later visits the
 * track resumes at the first click or keypress (browsers block autoplay, so
 * the control shows a quiet "waiting" state until then).
 */
export function AudioToggle() {
  const audioUrl = site.audio.url;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<SoundState>('off');

  // Create the element once, on first use.
  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      const el = new Audio(withBase(audioUrl));
      el.loop = true;
      el.volume = site.audio.volume;
      el.addEventListener('ended', () => setState('off'));
      audioRef.current = el;
    }
    return audioRef.current;
  }, [audioUrl]);

  // Restore the reader's previous choice. Autoplay will usually be blocked,
  // so fall back to resuming on the first interaction with the page.
  useEffect(() => {
    if (!audioUrl) return;

    let resumeListener: (() => void) | null = null;

    if (localStorage.getItem(STORAGE_KEY) === 'on') {
      const audio = getAudio();
      audio
        .play()
        .then(() => setState('playing'))
        .catch(() => {
          setState('waiting');
          resumeListener = () => {
            audio
              .play()
              .then(() => setState('playing'))
              .catch(() => setState('off'));
            window.removeEventListener('pointerdown', resumeListener!);
            window.removeEventListener('keydown', resumeListener!);
          };
          window.addEventListener('pointerdown', resumeListener, { once: false });
          window.addEventListener('keydown', resumeListener, { once: false });
        });
    }

    return () => {
      if (resumeListener) {
        window.removeEventListener('pointerdown', resumeListener);
        window.removeEventListener('keydown', resumeListener);
      }
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [audioUrl, getAudio]);

  if (!audioUrl) return null;

  const toggle = () => {
    const audio = getAudio();

    if (state === 'playing') {
      audio.pause();
      localStorage.setItem(STORAGE_KEY, 'off');
      setState('off');
      return;
    }

    audio
      .play()
      .then(() => {
        localStorage.setItem(STORAGE_KEY, 'on');
        setState('playing');
      })
      .catch(() => setState('off'));
  };

  const label =
    state === 'playing' ? 'Sound on' : state === 'waiting' ? 'Sound resumes on click' : 'Sound off';

  return (
    <button
      type="button"
      className={`audio-toggle${state === 'playing' ? ' audio-toggle--on' : ''}`}
      onClick={toggle}
      aria-pressed={state === 'playing'}
      title={label}
      aria-label={`${site.audio.title}: ${label}`}
    >
      <span className="audio-toggle__bars" aria-hidden="true">
        <i /><i /><i />
      </span>
      <span className="audio-toggle__label">Sound</span>
    </button>
  );
}
