"use client";
import { useRouter } from "next/navigation";
import { Play } from "lucide-react";
import type { YouTubeVideo } from "@/lib/youtube";

export default function MovieCard({ video }: { video: YouTubeVideo }) {
  const router = useRouter();
  const thumb = video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.high?.url;
  return (
    <div onClick={() => router.push(`/watch?id=${video.id.videoId}`)}
      className="group cursor-pointer rounded-xl overflow-hidden bg-[hsl(220,18%,11%)] border border-[hsl(220,15%,16%)] hover:border-[hsl(14,100%,57%,0.4)] transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/40">
      <div className="relative aspect-video overflow-hidden bg-[hsl(220,15%,14%)]">
        <img src={thumb} alt={video.snippet.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-brand flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100 shadow-lg">
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
        </div>
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium text-white line-clamp-2 leading-snug mb-1.5 group-hover:text-brand-light transition-colors">
          {video.snippet.title}
        </h3>
        <p className="text-xs text-[hsl(220,10%,45%)] truncate">{video.snippet.channelTitle}</p>
      </div>
    </div>
  );
}
