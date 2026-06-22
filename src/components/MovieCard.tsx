"use client";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import Link from "next/link";

type MovieCardProps = {
  title: string;
  url: string;
  thumbnail: string | null;
};
const MovieCard = ({ title, url, thumbnail }: MovieCardProps) => {
  return (
    <Card
      sx={{
        padding: "20px",
        background: "transparent",
        border: "1px solid #ff5724",
        borderRadius: "10px",
      }}
    >
      <CardActionArea component={Link} href={url}>
        <CardContent sx={{ padding: "0px 0px 10px 0px" }}>
          <Typography
            variant="body2"
            sx={{
              color: "White",
              fontWeight: 500,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {title}
          </Typography>
        </CardContent>
        <CardMedia
          component="img"
          height="194"
          image={thumbnail || "/placeholder-poster.jpg"}
          alt={title}
        />
      </CardActionArea>
    </Card>
  );
};

export default MovieCard;
