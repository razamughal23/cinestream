export interface YouTubeVideo {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    channelTitle: string;
    thumbnails: {
      default: { url: string };
      medium: { url: string };
      high: { url: string };
    };
  };
}

export interface YouTubeSearchResponse {
  items: YouTubeVideo[];
  nextPageToken?: string;
  prevPageToken?: string;
  pageInfo: { totalResults: number; resultsPerPage: number };
}

export interface YouTubeVideoDetails {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    channelTitle: string;
    tags?: string[];
    thumbnails: {
      maxres?: { url: string };
      high: { url: string };
      medium: { url: string };
    };
  };
  statistics: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
  contentDetails: { duration: string };
}

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY!;
const BASE = "https://www.googleapis.com/youtube/v3";

export async function searchMovies(query: string, pageToken?: string): Promise<YouTubeSearchResponse> {
  const p = new URLSearchParams({ part: "snippet", type: "video", maxResults: "20", q: `${query} movie`, key: API_KEY, ...(pageToken ? { pageToken } : {}) });
  const res = await fetch(`${BASE}/search?${p}`);
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}

export async function getTrendingMovies(): Promise<YouTubeSearchResponse> {
  const p = new URLSearchParams({ part: "snippet", type: "video", maxResults: "20", q: "latest movies 2025 trailer", order: "date", key: API_KEY });
  const res = await fetch(`${BASE}/search?${p}`);
  if (!res.ok) throw new Error("Trending failed");
  return res.json();
}

export async function getVideoDetails(videoId: string): Promise<YouTubeVideoDetails> {
  const p = new URLSearchParams({ part: "snippet,statistics,contentDetails", id: videoId, key: API_KEY });
  const res = await fetch(`${BASE}/videos?${p}`);
  if (!res.ok) throw new Error("Details failed");
  const data = await res.json();
  return data.items[0];
}

export async function getRelatedVideos(videoId: string): Promise<YouTubeSearchResponse> {
  const p = new URLSearchParams({ part: "snippet", type: "video", maxResults: "8", relatedToVideoId: videoId, key: API_KEY });
  const res = await fetch(`${BASE}/search?${p}`);
  if (!res.ok) {
    const fb = new URLSearchParams({ part: "snippet", type: "video", maxResults: "8", q: "popular movies 2025", key: API_KEY });
    const r = await fetch(`${BASE}/search?${fb}`);
    return r.json();
  }
  return res.json();
}

export function formatViewCount(n: string): string {
  const x = parseInt(n, 10);
  if (x >= 1_000_000) return `${(x / 1_000_000).toFixed(1)}M`;
  if (x >= 1_000) return `${(x / 1_000).toFixed(1)}K`;
  return String(x);
}

export function formatDuration(iso: string): string {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return "";
  const h = parseInt(m[1] || "0"), min = parseInt(m[2] || "0"), s = parseInt(m[3] || "0");
  if (h > 0) return `${h}:${String(min).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  return `${min}:${String(s).padStart(2,"0")}`;
}
