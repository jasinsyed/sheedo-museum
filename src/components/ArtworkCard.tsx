import Link from "next/link";
import type { Artwork } from "@/types/artwork";

export default function ArtworkCard({
  artwork,
  index = 0,
}: {
  artwork: Artwork;
  index?: number;
}) {
  return (
    <article className={`art-card art-card-${index % 3}`}>
      <Link
        href={`/artwork/${artwork.id}`}
        className="art-image-wrap"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={artwork.image}
          alt={artwork.title}
          className="art-image"
          loading="lazy"
        />

        <span className="view-art">View artwork ↗</span>
      </Link>

      <div className="art-meta">
        <div className="art-meta-info">
          <h3>{artwork.title}</h3>
          <p>{artwork.medium || "Original artwork"}</p>
        </div>

        {artwork.year && (
          <span className="art-year">{artwork.year}</span>
        )}
      </div>
    </article>
  );
}