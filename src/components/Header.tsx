"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Film, Menu, X, TrendingUp } from "lucide-react";

export default function Header() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setMenuOpen(false);
  }

  const nav = [
    { label: "Home", href: "/" },
    { label: "Trending", href: "/search?q=trending+movies+2025", icon: TrendingUp },
    { label: "Action", href: "/search?q=action+movies+2025" },
    { label: "Horror", href: "/search?q=horror+movies+2025" },
    { label: "Comedy", href: "/search?q=comedy+movies+2025" },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[hsl(220,20%,6%)] shadow-lg shadow-black/40" : "bg-gradient-to-b from-[hsl(220,20%,6%)] to-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 h-16">
          {/* Logo */}
          <button onClick={() => router.push("/")} className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
              <Film className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-white hidden sm:block">
              Cine<span className="text-brand">Stream</span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 ml-2">
            {nav.map(({ label, href }) => (
              <button key={label} onClick={() => router.push(href)}
                className="px-3 py-1.5 text-sm font-medium text-[hsl(220,10%,65%)] hover:text-white transition-colors rounded-md hover:bg-white/5">
                {label}
              </button>
            ))}
          </nav>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl ml-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(220,10%,45%)] pointer-events-none" />
              <input type="search" value={q} onChange={e => setQ(e.target.value)}
                placeholder="Search movies, trailers..."
                className="w-full bg-[hsl(220,15%,14%)] border border-[hsl(220,15%,20%)] rounded-full pl-9 pr-4 py-2 text-sm text-white placeholder-[hsl(220,10%,40%)] focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all" />
            </div>
          </form>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 text-[hsl(220,10%,65%)] hover:text-white" onClick={() => setMenuOpen(v => !v)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="md:hidden border-t border-[hsl(220,15%,18%)] py-3 pb-4 flex flex-col gap-1">
            {nav.map(({ label, href }) => (
              <button key={label} onClick={() => { router.push(href); setMenuOpen(false); }}
                className="w-full text-left px-4 py-2 text-sm text-[hsl(220,10%,75%)] hover:text-white hover:bg-white/5 rounded">
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
