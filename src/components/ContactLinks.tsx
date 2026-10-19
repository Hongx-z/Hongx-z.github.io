import { site, type ContactLink } from '@/data/site';

interface ContactLinksProps {
  /**
   * `inline` is the footer: labels separated by middots, nothing else.
   * `rows` is the About page: a label and its value on their own line — the
   * same shape for the email address and the WeChat Official Account, so no
   * contact looks more or less important than the others.
   */
  variant?: 'inline' | 'rows';
}

function ContactValue({ link, className }: { link: ContactLink; className: string }) {
  const text = link.value ?? link.label;

  if (!link.href) {
    return <span className={className}>{text}</span>;
  }

  return (
    <a
      className={`${className} link-underline`}
      href={link.href}
      {...(link.href.startsWith('http')
        ? { target: '_blank', rel: 'noreferrer noopener' }
        : {})}
    >
      {text}
    </a>
  );
}

/**
 * Where to find me — the footer's list and the About page's, from one source.
 *
 * A WeChat Official Account has no profile URL to send anyone to, so it is
 * printed as a value rather than dressed up as a link that goes nowhere.
 */
export function ContactLinks({ variant = 'inline' }: ContactLinksProps) {
  if (variant === 'rows') {
    return (
      <>
        {site.links.map((link) => (
          <div key={link.label} className="about-aside__row">
            <span className="about-aside__label">{link.label}</span>
            <ContactValue link={link} className="about-aside__value" />
          </div>
        ))}
      </>
    );
  }

  return (
    <>
      {site.links.map((link, index) => (
        <span key={link.label} className="contact">
          {index > 0 ? (
            <span className="dot-sep" aria-hidden="true">
              ·
            </span>
          ) : null}

          {link.href ? (
            <a
              className="link-underline"
              href={link.href}
              {...(link.href.startsWith('http')
                ? { target: '_blank', rel: 'noreferrer noopener' }
                : {})}
            >
              {link.label}
            </a>
          ) : (
            <span className="contact__label">{link.label}</span>
          )}
        </span>
      ))}
    </>
  );
}
