
"use client";

import { useMemo, useState } from "react";
import ArtworkCard from "@/components/ArtworkCard";
import type { Artwork } from "@/types/artwork";

export default function GalleryContent({
  artworks,
}: {
  artworks: Artwork[];
}) {
  const categories = [
    "All works",
    ...Array.from(
      new Set(
        artworks
          .map((art) => art.collection)
          .filter(Boolean)
      )
    ),
  ];

  const [active, setActive] = useState("All works");

  const visible = useMemo(
    () =>
      active === "All works"
        ? artworks
        : artworks.filter(
            (art) => art.collection === active
          ),
    [active, artworks]
  );

  return (
    <section className="section page-section">
      <p className="eyebrow">THE MUSEUM COLLECTION</p>

      <div className="page-title-row">
        <h1>
          The <em>collection.</em>
        </h1>

        <span>
          {String(visible.length).padStart(2, "0")} WORKS
        </span>
      </div>

      <p className="page-lede">
        A growing archive of paintings, drawings and visual
        explorations.
      </p>

      {categories.length > 1 && (
        <div className="filter-row" aria-label="Filter artworks">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActive(category)}
              className={
                active === category
                  ? "filter active"
                  : "filter"
              }
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {visible.length > 0 ? (
        <div className="art-grid gallery-grid">
          {visible.map((art, index) => (
            <ArtworkCard
              key={art.id}
              artwork={art}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="empty-collection">
          <p className="eyebrow">THE COLLECTION IS GROWING</p>
          <h3>No artworks to display yet.</h3>
          <p>
            Sheedo's original paintings and drawings will
            appear here when published.
          </p>
        </div>
      )}
    </section>
  );
}

