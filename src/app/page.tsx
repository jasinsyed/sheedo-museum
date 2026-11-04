
import Link from "next/link";
import ArtworkCard from "@/components/ArtworkCard";
import { getArtworks } from "@/lib/get-artworks";

export const dynamic = "force-dynamic";

export default async function Home() {
  const artworks = await getArtworks();

  const featured = artworks.filter((art) => art.featured);
  const heroArtwork = featured[0] ?? artworks[0] ?? null;

  const selected = [
    ...featured,
    ...artworks.filter((art) => !art.featured),
  ].slice(0, 3);

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="eyebrow-line" />
            THE ARTISTIC WORLD OF SHEEDO
          </p>

          <h1>
            Beyond what
            <br />
            the eyes <em>see.</em>
          </h1>

          <p className="hero-description">
            An intimate collection of paintings, drawings, and
            creative expressions. A space where imagination meets
            emotion, and every artwork tells its own story.
          </p>

          <div className="hero-actions">
            <Link href="/gallery" className="primary-link">
              Explore the collection <span>↗</span>
            </Link>

            <Link href="/about" className="hero-secondary-link">
              Meet the artist
            </Link>
          </div>

          <div className="hero-small-note">
            <span>INDEPENDENT ARTIST</span>
            <span>—</span>
            <span>BASRA, IRAQ</span>
          </div>
        </div>

        <div className="hero-art">
          {heroArtwork ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroArtwork.image}
                alt={heroArtwork.title}
                fetchPriority="high"
              />

              <div className="hero-caption">
                <span>{heroArtwork.title}</span>
                <Link href={`/artwork/${heroArtwork.id}`}>
                  VIEW ARTWORK ↗
                </Link>
              </div>
            </>
          ) : (
            <div className="hero-art-placeholder">
              <p>THE SHEEDO COLLECTION</p>
              <span>NEW WORKS COMING SOON</span>
            </div>
          )}

          <div className="hero-index">
            DIGITAL ART MUSEUM
            <br />
            EST. MMXXV
          </div>
        </div>
      </section>

      <section className="intro-strip">
        <p>WELCOME TO SHEEDO'S WORLD</p>
        <p>PAINTINGS · DRAWINGS · EXPRESSION</p>
      </section>

      <section className="section collection-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A CURATED SELECTION</p>
            <h2>
              Selected <em>works.</em>
            </h2>
          </div>

          <Link href="/gallery" className="text-link">
            Explore all artworks ↗
          </Link>
        </div>

        {selected.length > 0 ? (
          <div className="art-grid">
            {selected.map((art, index) => (
              <ArtworkCard
                key={art.id}
                artwork={art}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="empty-collection">
            <p className="eyebrow">A COLLECTION IN THE MAKING</p>
            <h3>Every great collection begins somewhere.</h3>
            <p>
              Sheedo's original artworks will appear here when
              they are uploaded to the museum.
            </p>
          </div>
        )}

        <div className="collection-bottom">
          <span>THE SHEEDO COLLECTION</span>
          <span>
            {String(selected.length).padStart(2, "0")} ARTWORKS
          </span>
        </div>
      </section>

      <section className="statement">
        <p className="eyebrow">ART IS MORE THAN WHAT WE SEE</p>

        <h2>
          Every work holds
          <br />
          a <em>little universe.</em>
        </h2>

        <p className="statement-copy">
          A line, a colour, a moment, an emotion. This museum
          invites you to slow down, look closer, and experience
          the imagination behind each creation.
        </p>

        <Link href="/about" className="text-link">
          Discover Sheedo's story ↗
        </Link>
      </section>

      <section className="home-closing">
        <p className="eyebrow">A WORLD WAITING TO BE DISCOVERED</p>

        <h2>
          Take a moment.
          <br />
          <em>Enter her world.</em>
        </h2>

        <Link href="/gallery" className="primary-link">
          Enter the museum <span>↗</span>
        </Link>
      </section>
    </>
  );
}
