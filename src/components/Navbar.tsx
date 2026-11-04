import Link from "next/link";

export default function Navbar() {
  return (
    <header className="site-header">
      <Link href="/" className="wordmark" aria-label="Sheedo Museum home">SHEEDO<span>.</span></Link>
      <nav className="main-nav" aria-label="Main navigation">
        <Link href="/gallery">The collection</Link>
        <Link href="/about">About</Link>
      </nav>
      <Link href="/admin/login" className="studio-link">Artist studio <span>↗</span></Link>
    </header>
  );
}
