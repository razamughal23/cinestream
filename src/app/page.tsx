"use client";
import { useState, useEffect, useMemo } from "react";
import { Search, Flame } from "lucide-react";
import MovieCard from "@/components/MovieCard";
import {
  Container,
  Grid,
  Box,
  Tabs,
  Tab,
  Typography,
  Pagination,
} from "@mui/material";

type Movie = {
  id: number;
  title: string;
  url: string;
  thumbnail: string | null;
};

type MoviesData = {
  [year: string]: Movie[];
};

const ITEMS_PER_PAGE = 40;

export default function HomePage() {
  const [query, setQuery] = useState("");
  // "all" = sab movies, ya year ka string e.g. "2020"
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [moviesData, setMoviesData] = useState<MoviesData>({});
  const [page, setPage] = useState(1);

  // ================= LOAD JSON =================
  useEffect(() => {
    async function loadData() {
      const res = await fetch("/data/movies.json");
      const data = await res.json();
      setMoviesData(data);
    }
    loadData();
  }, []);

  // ================= YEARS (tabs ke liye) =================
  const YEARS = useMemo(() => {
    return Object.keys(moviesData)
      .map(Number)
      .sort((a, b) => b - a);
  }, [moviesData]);

  // ================= SAARI MOVIES (All tab ke liye, flatten) =================
  const allMovies: Movie[] = useMemo(() => {
    return Object.values(moviesData).flat();
  }, [moviesData]);

  // ================= JIS TAB PER HO USKA DATA =================
  const currentYearMovies: Movie[] = useMemo(() => {
    if (selectedYear === "all") return allMovies;
    return moviesData[selectedYear] || [];
  }, [moviesData, selectedYear, allMovies]);

  // ================= SEARCH FILTER =================
  const filteredMovies: Movie[] = useMemo(() => {
    if (!query.trim()) return currentYearMovies;
    return currentYearMovies.filter((m) =>
      m.title.toLowerCase().includes(query.toLowerCase()),
    );
  }, [currentYearMovies, query]);

  // tab ya search change hone par page 1 par reset
  useEffect(() => {
    setPage(1);
  }, [selectedYear, query]);

  // ================= PAGINATION =================
  const totalPages = Math.max(
    1,
    Math.ceil(filteredMovies.length / ITEMS_PER_PAGE),
  );

  const paginatedMovies: Movie[] = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredMovies.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredMovies, page]);

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative pt-24 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/8 via-transparent to-transparent pointer-events-none" />

        <div className="mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-500/30 rounded-full px-4 py-1.5 mb-6">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-xs font-medium text-orange-300">
              Free movies & trailers
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            Watch Movies <br />
            <span className="text-orange-500">Online Free</span>
          </h1>

          {/* ================= SEARCH ================= */}
          <div className="relative max-w-xl mx-auto flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies..."
              className="w-full bg-[hsl(220,15%,14%)] border border-[hsl(220,15%,22%)] rounded-2xl pl-12 pr-32 py-4 text-white"
            />
          </div>
        </div>

        {/* ================= TABS ================= */}
        <Container sx={{ mt: 5 }}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Tabs
              value={selectedYear}
              onChange={(e, val) => setSelectedYear(val)}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                "& .MuiTab-root": {
                  color: "#aaa",
                  fontWeight: 500,
                  minWidth: 70,
                },
                "& .Mui-selected": {
                  color: "#ff5724 !important",
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#ff5724",
                  height: 3,
                },
              }}
            >
              <Tab label="All" value="all" />
              {YEARS.map((year) => (
                <Tab key={year} label={year} value={String(year)} />
              ))}
            </Tabs>
          </Box>

          {/* ================= GRID ================= */}
          <Grid container spacing={2}>
            {paginatedMovies.length > 0 ? (
              paginatedMovies.map((movie) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={movie.id}>
                  <MovieCard
                    title={movie.title}
                    url={movie.url}
                    thumbnail={movie.thumbnail}
                  />
                </Grid>
              ))
            ) : (
              <Box sx={{ p: 3, width: "100%", textAlign: "center" }}>
                <Typography sx={{ color: "#999" }}>
                  No movies found for{" "}
                  {selectedYear === "all" ? "All" : selectedYear}
                </Typography>
              </Box>
            )}
          </Grid>

          {/* ================= PAGINATION CONTROLS ================= */}
          {filteredMovies.length > ITEMS_PER_PAGE && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, val) => setPage(val)}
                sx={{
                  "& .MuiPaginationItem-root": { color: "#ccc" },
                  "& .Mui-selected": {
                    backgroundColor: "red !important",
                    color: "#fff",
                  },
                }}
              />
            </Box>
          )}
        </Container>
      </section>
    </>
  );
}
