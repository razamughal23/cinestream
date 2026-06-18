"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Film, ChevronLeft, ChevronRight } from "lucide-react";
import { searchMovies, type YouTubeVideo } from "@/lib/youtube";
import MovieCard from "@/components/MovieCard";
import AdBanner from "@/components/AdBanner";

function SearchContent() {
  const router = useRouter();
  const params = useSearchParams();
  const query = params.get("q") || "";
  const [results, setResults] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [nextPage, setNextPage] = useState<string|undefined>();
  const [prevPage, setPrevPage] = useState<string|undefined>();
  const [input, setInput] = useState(query);
  const prevQ = useRef("");

  useEffect(() => {
    setInput(query);
    if (!query || query === prevQ.current) return;
    prevQ.current = query;
    doSearch(query, undefined);
  }, [query]);

  async function doSearch(q: string, pageToken?: string) {
    if (!q) return;
    setLoading(true); setError(null);
    try {
      const res = await searchMovies(q, pageToken);
      setResults(res.items || []);
      setNextPage(res.nextPageToken);
      setPrevPage(res.prevPageToken);
      window.scrollTo({top:0, behavior:"smooth"});
    } catch { setError("Failed to load results. Please try again."); }
    finally { setLoading(false); }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = input.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
      {/* Search bar */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="max-w-2xl">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-[hsl(220,10%,40%)]" />
            <input type="search" value={input} onChange={e => setInput(e.target.value)}
              placeholder="Search movies..."
              className="w-full bg-[hsl(220,15%,14%)] border border-[hsl(220,15%,20%)] rounded-xl pl-11 pr-28 py-3 text-white placeholder-[hsl(220,10%,38%)] focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/40 transition-all" />
            <button type="submit" className="absolute right-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg px-4 py-2 text-sm transition-all">
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Top ad */}
      {/* <div className="mb-8"><AdBanner slot="4567890123" format="horizontal" style={{minHeight:90}} /></div> */}

      {query && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">
            Results for: <span className="text-orange-500">{query}</span>
          </h1>
          {results.length > 0 && <p className="text-sm text-[hsl(220,10%,50%)] mt-1">{results.length} results found</p>}
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({length:20}).map((_,i) => (
            <div key={i} className="rounded-xl overflow-hidden bg-[hsl(220,18%,11%)] animate-pulse">
              <div className="aspect-video bg-[hsl(220,15%,16%)]" />
              <div className="p-3 space-y-2"><div className="h-3 bg-[hsl(220,15%,16%)] rounded w-full"/><div className="h-3 bg-[hsl(220,15%,16%)] rounded w-2/3"/></div>
            </div>
          ))}
        </div>
      )}

      {error && !loading && <div className="text-center py-20"><p className="text-[hsl(220,10%,50%)]">{error}</p></div>}

      {!loading && !error && results.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
            {results.slice(0,8).map(v => <MovieCard key={v.id.videoId} video={v} />)}
          </div>
          {/* <div className="mb-8"><AdBanner slot="5678901234" format="horizontal" style={{minHeight:90}} /></div> */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
            {results.slice(8).map(v => <MovieCard key={v.id.videoId} video={v} />)}
          </div>
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => doSearch(query, prevPage)} disabled={!prevPage||loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[hsl(220,18%,11%)] border border-[hsl(220,15%,18%)] text-sm font-medium text-white disabled:opacity-40 disabled:cursor-not-allowed hover:border-orange-500/50 transition-all">
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <button onClick={() => doSearch(query, nextPage)} disabled={!nextPage||loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-orange-500 text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-orange-600 transition-all">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}

      {!loading && !error && results.length === 0 && query && (
        <div className="text-center py-24">
          <Film className="w-12 h-12 text-[hsl(220,10%,30%)] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[hsl(220,10%,60%)] mb-2">No results found</h3>
          <p className="text-sm text-[hsl(220,10%,40%)]">Try a different search term</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="pt-24 text-center text-white">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
