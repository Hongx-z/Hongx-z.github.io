interface ProseProps {
  /** HTML produced by `markdownToHtml()`. Always from our own content files. */
  html: string;
  /** `article` enables the drop cap and long-form measure. */
  variant?: 'default' | 'article';
}

export function Prose({ html, variant = 'default' }: ProseProps) {
  const classes = ['prose'];
  if (variant === 'article') classes.push('prose--article');

  return <div className={classes.join(' ')} dangerouslySetInnerHTML={{ __html: html }} />;
}
