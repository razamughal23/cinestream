"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Container,
  Box,
  Typography,
  Button,
  Stack,
  Skeleton,
  Chip,
  IconButton,
} from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

type Movie = {
  id: number;
  title: string;
  url: string;
  thumbnail: string | null;
  videourl1: string;
};

type MoviesData = {
  [year: string]: Movie[];
};

// ================= PLAYER LINKS (JSON se alag, yahan manually daalo) =================
// "url" mein apna actual embed/player link paste karo (jo iframe mein chalta ho)
const PLAYERS = [
  { name: "Server 1", url: "" },
  { name: "Server 2", url: "" },
  { name: "Server 3", url: "" },
  { name: "Server 4", url: "" },
];

export default function MoviePlayerPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params?.slug;

  const [moviesData, setMoviesData] = useState<MoviesData>({});
  const [loading, setLoading] = useState(true);
  const [activePlayer, setActivePlayer] = useState(0);

  // ================= LOAD JSON =================
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/data/movies.json");
        const data = await res.json();
        setMoviesData(data);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // ================= SLUG SE MOVIE DHOONDO =================
  const movie: Movie | undefined = useMemo(() => {
    if (!slug) return undefined;
    const target = `/${slug}/`;
    for (const year of Object.keys(moviesData)) {
      const found = moviesData[year].find((m) => m.url === target);
      if (found) return found;
    }
    return undefined;
  }, [moviesData, slug]);

  const currentPlayerUrl = PLAYERS[activePlayer]?.url;
  // const currentPlayerUrl = movie?.videourl1;

  // ================= LOADING STATE =================
  if (loading) {
    return (
      <Container sx={{ py: 6 }}>
        <Skeleton
          variant="rectangular"
          height={480}
          sx={{ borderRadius: 2, bgcolor: "hsl(220,15%,18%)" }}
        />
        <Skeleton
          width="60%"
          height={40}
          sx={{ mt: 2, bgcolor: "hsl(220,15%,18%)" }}
        />
      </Container>
    );
  }

  // ================= NOT FOUND =================
  if (!movie) {
    return (
      <Container sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h5" sx={{ color: "#999" }}>
          Movie not found
        </Typography>
        <Button sx={{ mt: 2 }} color="error" onClick={() => router.push("/")}>
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 6 }}>
      {/* ================= BACK ================= */}
      <IconButton
        onClick={() => router.push("/")}
        sx={{ color: "#ccc", mb: 1 }}
      >
        <ArrowBackIcon />
      </IconButton>

      {/* ================= PLAYER ================= */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "16/9",
          bgcolor: "black",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        {currentPlayerUrl ? (
          <iframe
            key={currentPlayerUrl}
            src={currentPlayerUrl}
            allow="autoplay; fullscreen; encrypted-media"
            allowFullScreen
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#999",
              gap: 1,
            }}
          >
            <PlayCircleIcon sx={{ fontSize: 56 }} />
            <Typography variant="body2">
              Is server ka link abhi add nahi hua — neeche se koi aur server try
              karo
            </Typography>
          </Box>
        )}
      </Box>

      {/* ================= SERVER / PLAYER BUTTONS ================= */}
      <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap" }}>
        {PLAYERS.map((p, i) => (
          <Button
            key={p.name}
            variant={activePlayer === i ? "contained" : "outlined"}
            color="error"
            size="small"
            onClick={() => setActivePlayer(i)}
          >
            {p.name}
          </Button>
        ))}
      </Stack>

      {/* ================= MOVIE INFO ================= */}
      <Box sx={{ mt: 4, display: "flex", gap: 3, flexWrap: "wrap" }}>
        <Box
          component="img"
          src={movie.thumbnail || "/placeholder-poster.jpg"}
          alt={movie.title}
          sx={{ width: 160, borderRadius: 2, flexShrink: 0 }}
        />
        <Box>
          <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>
            {movie.title}
          </Typography>
          <Chip label="HD" color="error" size="small" sx={{ mt: 1 }} />
        </Box>
      </Box>
    </Container>
  );
}
