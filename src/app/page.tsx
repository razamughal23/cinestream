"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, TrendingUp, Star, Flame, ChevronRight } from "lucide-react";
import { getTrendingMovies, searchMovies, type YouTubeVideo } from "@/lib/youtube";
import MovieCard from "@/components/MovieCard";
import AdBanner from "@/components/AdBanner";

const GENRES = [
  { label: "Action", q: "action movies 2025" },
  { label: "Horror", q: "horror movies 2025" },
  { label: "Comedy", q: "comedy movies 2025" },
  { label: "Drama", q: "drama movies 2025" },
  { label: "Sci-Fi", q: "sci-fi movies 2025" },
  { label: "Romance", q: "romance movies 2025" },
  { label: "Thriller", q: "thriller movies 2025" },
  { label: "Bollywood", q: "bollywood movies 2025" },
];

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [trending, setTrending] = useState<YouTubeVideo[]>([]);
  const [featured, setFeatured] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getTrendingMovies(), searchMovies("best movies 2025")])
      .then(([t, f]) => { setTrending(t.items?.slice(0,10)||[]); setFeatured(f.items?.slice(0,10)||[]); })
      .finally(() => setLoading(false));
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  const Skeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({length:10}).map((_,i) => (
        <div key={i} className="rounded-xl overflow-hidden bg-[hsl(220,18%,11%)] animate-pulse">
          <div className="aspect-video bg-[hsl(220,15%,16%)]" />
          <div className="p-3 space-y-2"><div className="h-3 bg-[hsl(220,15%,16%)] rounded w-full"/><div className="h-3 bg-[hsl(220,15%,16%)] rounded w-2/3"/></div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Hero */}
      <section className="relative pt-24 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/8 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-500/30 rounded-full px-4 py-1.5 mb-6">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-xs font-medium text-orange-300">Free movies &amp; trailers</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Watch Movies<br /><span className="text-orange-500">Online Free</span>
          </h1>
          <p className="text-lg text-[hsl(220,10%,55%)] mb-8 max-w-xl mx-auto">
            Search and stream thousands of movies, trailers and clips — all in one place.
          </p>
          <form onSubmit={handleSearch} className="max-w-xl mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-[hsl(220,10%,40%)]" />
              <input type="search" value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search movies, trailers, genres..."
                className="w-full bg-[hsl(220,15%,14%)] border border-[hsl(220,15%,22%)] rounded-2xl pl-12 pr-32 py-4 text-white placeholder-[hsl(220,10%,38%)] focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition-all text-base" />
              <button type="submit" className="absolute right-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl px-5 py-2.5 transition-all text-sm">
                Search
              </button>
            </div>
          </form>
          <div className="flex flex-wrap gap-2 justify-center mt-6">
            {GENRES.map(({label, q}) => (
              <button key={label} onClick={() => router.push(`/search?q=${encodeURIComponent(q)}`)}
                className="px-4 py-1.5 text-sm bg-[hsl(220,15%,14%)] border border-[hsl(220,15%,20%)] rounded-full text-[hsl(220,10%,65%)] hover:border-orange-500/50 hover:text-white transition-all">
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Top banner ad */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <AdBanner slot="1234567890" format="horizontal" style={{minHeight:90}} />
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        {/* Trending */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-bold text-white">Trending Now</h2>
            </div>
            <button onClick={() => router.push("/search?q=trending+movies+2025")}
              className="flex items-center gap-1 text-sm text-orange-500 hover:text-orange-300 transition-colors">
              See all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          {loading ? <Skeleton /> : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {trending.map(v => <MovieCard key={v.id.videoId} video={v} />)}
            </div>
          )}
        </section>

        {/* Mid ad */}
        <div className="mb-12">
          <AdBanner slot="2345678901" format="horizontal" style={{minHeight:90}} />
        </div>

        {/* Best of 2025 */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-bold text-white">Best of 2025</h2>
            </div>
            <button onClick={() => router.push("/search?q=best+movies+2025")}
              className="flex items-center gap-1 text-sm text-orange-500 hover:text-orange-300 transition-colors">
              See all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          {loading ? <Skeleton /> : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {featured.map(v => <MovieCard key={v.id.videoId} video={v} />)}
            </div>
          )}
        </section>

        {/* Bottom ad */}
        <AdBanner slot="3456789012" format="rectangle" style={{minHeight:250}} />
      </div>
    </>
  );
}
