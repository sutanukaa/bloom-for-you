import { NextRequest, NextResponse } from "next/server";

// Song search via the iTunes Search API — free, keyless, previews + artwork.
// Proxied because itunes.apple.com doesn't send CORS headers to browsers.
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q) return NextResponse.json({ songs: [] });

  const res = await fetch(
    `https://itunes.apple.com/search?media=music&entity=song&limit=8&term=${encodeURIComponent(q)}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return NextResponse.json({ songs: [] });

  const data = await res.json();
  type ItunesTrack = {
    trackName: string;
    artistName: string;
    artworkUrl100?: string;
    previewUrl?: string;
    trackViewUrl?: string;
  };
  const songs = ((data.results ?? []) as ItunesTrack[]).map((t) => ({
    title: t.trackName,
    artist: t.artistName,
    artwork: t.artworkUrl100?.replace("100x100", "200x200") ?? "",
    preview: t.previewUrl ?? "",
    link: t.trackViewUrl ?? "",
  }));
  return NextResponse.json({ songs });
}
