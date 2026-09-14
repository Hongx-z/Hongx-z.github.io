import Link from 'next/link';

interface TagRowProps {
  tags: string[];
  tagSlugs: string[];
  /** Render as non-clickable pills (used on archive pages listing everything). */
  plain?: boolean;
}

export function TagRow({ tags, tagSlugs, plain = false }: TagRowProps) {
  if (tags.length === 0) return null;

  return (
    <div className="tag-row">
      {tags.map((label, index) => {
        const slug = tagSlugs[index];
        if (plain || !slug) {
          return (
            <span key={label} className="tag tag--plain">
              {label}
            </span>
          );
        }
        return (
          <Link key={slug} href={`/tags/${slug}`} className="tag">
            {label}
          </Link>
        );
      })}
    </div>
  );
}
