interface ProseProps {
  /** HTML produced by `markdownToHtml()`. Always from our own content files. */
  html: string;
  /** `article` enables the drop cap and long-form measure. */
  variant?: 'default' | 'article';
  /**
   * BCP-47 tag for the text, e.g. 'zh'. Set from the content's own language:
   * Chinese wants looser leading and no drop cap, and marking it up lets a
   * screen reader pronounce it properly.
   */
  lang?: string;
  /** Extra classes for the wrapper, for page-specific measures. */
  className?: string;
}

/** Chinese, Japanese and Korean — the scripts that are set, not spelled. */
function isCjk(lang?: string): boolean {
  return Boolean(lang && /^(zh|ja|ko)/i.test(lang));
}

export function Prose({ html, variant = 'default', lang, className }: ProseProps) {
  const classes = ['prose'];
  if (variant === 'article') classes.push('prose--article');
  if (isCjk(lang)) classes.push('prose--cjk');
  if (className) classes.push(className);

  return (
    <div
      className={classes.join(' ')}
      {...(lang ? { lang } : {})}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
