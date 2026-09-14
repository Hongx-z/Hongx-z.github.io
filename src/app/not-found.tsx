import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="container container--prose section">
      <p className="eyebrow">404</p>
      <h1 className="about-head__title">This page is not here.</h1>
      <p className="about-head__headline lede">
        It may have been renamed, or it may never have existed. Both happen.
      </p>

      <p className="hero__links">
        <Link href="/" className="link-underline">
          Home →
        </Link>
        <Link href="/writing" className="link-underline">
          Writing →
        </Link>
        <Link href="/documentaries" className="link-underline">
          Films →
        </Link>
      </p>
    </section>
  );
}
