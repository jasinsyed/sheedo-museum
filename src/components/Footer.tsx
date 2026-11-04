import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <div className="wordmark footer-mark">SHEEDO<span>.</span></div>
        <p>A living collection of paintings, drawings and things worth looking at twice.</p>
      </div>
      <div className="footer-right">
        <span>AN ONLINE ART MUSEUM</span>
        <Link href="/gallery">Explore the collection ↗</Link>
        <small>© {new Date().getFullYear()} Sheedo. All artworks belong to their respective artist.</small>
      </div>
    </footer>
  );
}
