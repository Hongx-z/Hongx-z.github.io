'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * "Copy link" for articles. Uses the clipboard API where available and
 * falls back to a hidden textarea for older browsers / non-secure origins.
 */
export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const copy = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = url;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      className="copy-link"
      onClick={copy}
      aria-live="polite"
    >
      {copied ? 'Link copied' : 'Copy link'}
    </button>
  );
}
