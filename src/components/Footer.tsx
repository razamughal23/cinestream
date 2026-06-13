"use client";
import { useRouter } from "next/navigation";
import { Film } from "lucide-react";

export default function Footer() {
  const router = useRouter();
  const genres = [
    { label: "Trending", q: "trending movies 2025" },
    { label: "Action", q: "action movies 2025" },
    { label: "Horror", q: "horror movies 2025" },
    { label: "Comedy", q: "comedy movies 2025" },
    { label: "Drama", q: "drama movies 2025" },
    { label: "Sci-Fi", q: "sci fi movies 2025" },
    { label: "Bollywood", q: "bollywood movies 2025" },
  ];
  return (
    <footer className="bg-[hsl(220,20%,6%)] border-t border-[hsl(220,15%,14%)] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <button onClick={() => router.push("/")} className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
                <Film className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-white">Cine<span className="text-brand">Stream</span></span>
            </button>
            <p className="text-sm text-[hsl(220,10%,45%)] max-w-xs leading-relaxed">
              Your free destination for movies, trailers, and video content. Search and stream thousands of titles instantly.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Browse</h4>
            <ul className="space-y-2">
              {genres.map(({ label, q }) => (
                <li key={label}>
                  <button onClick={() => router.push(`/search?q=${encodeURIComponent(q)}`)}
                    className="text-sm text-[hsl(220,10%,50%)] hover:text-brand transition-colors">{label}</button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Info</h4>
            <ul className="space-y-2">
              {["About", "Privacy Policy", "Terms of Service", "DMCA", "Contact"].map(i => (
                <li key={i}><button className="text-sm text-[hsl(220,10%,50%)] hover:text-brand transition-colors">{i}</button></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-[hsl(220,15%,14%)] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[hsl(220,10%,35%)]">&copy; {new Date().getFullYear()} CineStream. All rights reserved.</p>
          <p className="text-xs text-[hsl(220,10%,35%)]">Powered by YouTube Data API v3</p>
        </div>
      </div>
    </footer>
  );
}
