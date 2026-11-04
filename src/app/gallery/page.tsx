
import GalleryContent from "@/components/GalleryContent";
import { getArtworks } from "@/lib/get-artworks";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const artworks = await getArtworks();

  return <GalleryContent artworks={artworks} />;
}
