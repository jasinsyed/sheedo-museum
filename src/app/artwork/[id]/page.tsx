
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArtworks } from "@/lib/get-artworks";

export const dynamic = "force-dynamic";

export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Retrieve actual artworks from Supabase
  const artworks = await getArtworks();

  // Find the requested artwork
  const artwork = artworks.find((art) => art.id === id);

  if (!artwork) {
    notFound();
  }

  return (
    <section className="section artwork-detail">

      <Link href="/gallery" className="back-link">
        ← Back to collection
      </Link>

      <div className="detail-layout">

        {/* ARTWORK IMAGE */}

        <div className="detail-image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={artwork.image}
            alt={artwork.title}
          />
        </div>

        {/* ARTWORK INFORMATION */}

        <div className="detail-copy">

          <p className="eyebrow">
            FROM THE COLLECTION · {artwork.collection.toUpperCase()}
          </p>

          <h1>
            {artwork.title}
            <span>.</span>
          </h1>

          <p className="detail-description">
            {artwork.description || "An original artwork by Sheedo."}
          </p>

          <dl className="art-facts">

            <div>
              <dt>ARTIST</dt>
              <dd>Sheedo</dd>
            </div>

            <div>
              <dt>YEAR</dt>
              <dd>{artwork.year || "Not specified"}</dd>
            </div>

            <div>
              <dt>MEDIUM</dt>
              <dd>{artwork.medium || "Not specified"}</dd>
            </div>

            <div>
              <dt>COLLECTION</dt>
              <dd>{artwork.collection}</dd>
            </div>

          </dl>

          <div className="detail-artist-note">
            <p className="eyebrow">THE ARTIST</p>
            <p>
              Every creation holds a story.
              Discover more of Sheedo's artistic world
              through her collection.
            </p>

            <Link href="/about" className="text-link">
              Discover the artist ↗
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
