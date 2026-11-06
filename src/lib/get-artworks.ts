
import "server-only";

import { isSupabaseConfigured, supabaseAdmin } from "@/lib/supabase-admin";
import type { Artwork } from "@/types/artwork";

// PLACEHOLDER: sample artworks shown only while Supabase is not configured
// (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY unset). Real data takes over
// automatically once those variables are set.
const SAMPLE_ARTWORKS: Artwork[] = [
  {
    id: "sample-basra",
    title: "Basra (Sample)",
    artist: "Sheedo",
    year: "2024",
    medium: "Sample artwork",
    collection: "Sample Collection",
    image: "/images/basra.jpg",
    description:
      "Placeholder entry shown until the museum collection database is connected.",
    featured: true,
  },
  {
    id: "sample-nature",
    title: "Nature (Sample)",
    artist: "Sheedo",
    year: "2024",
    medium: "Sample artwork",
    collection: "Sample Collection",
    image: "/images/nature.png",
    description:
      "Placeholder entry shown until the museum collection database is connected.",
    featured: false,
  },
];

export async function getArtworks(): Promise<Artwork[]> {
  if (!isSupabaseConfigured()) {
    console.warn(
      "Supabase is not configured; serving sample artworks. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
    return SAMPLE_ARTWORKS;
  }

  const { data, error } = await supabaseAdmin
    .from("artworks")
    .select(
      "id, title, medium, collection, year, description, image_url, featured, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch public artworks:", error.message);
    throw new Error("Unable to load the museum collection.");
  }

  return (data ?? []).map((art) => ({
    id: art.id,
    title: art.title,
    artist: "Sheedo",
    year: art.year ? String(art.year) : "",
    medium: art.medium ?? "",
    collection: art.collection ?? "Uncategorized",
    image: art.image_url,
    description: art.description ?? "",
    featured: art.featured ?? false,
  }));
}
