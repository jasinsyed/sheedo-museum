
import "server-only";

import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Artwork } from "@/types/artwork";

export async function getArtworks(): Promise<Artwork[]> {
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
