"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Play, ThumbsUp, Eye, Clock, Share2, ChevronLeft } from "lucide-react";
import { getVideoDetails, getRelatedVideos, formatViewCount, formatDuration, type YouTubeVideoDetails, type YouTubeVideo } from "@/lib/youtube";
import AdBanner from "@/components/AdBanner";

function WatchContent() {
  const router = useRouter();
  const params = useSearchParams();
  const videoId = params.get("id") || "";
  const [details, setDetails] = useState<YouTubeVideoDetails|null>(null);
  const [related, setRelated] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!videoId) return;
    setLoading(true);
    window.scrollTo({top:0, behavior:"smooth"});
    Promise.all([getVideoDetails(videoId), getRelatedVideos(videoId)])
      .then(([d,r]) => { setDetails(d); setRelated(r.items||[]); })
      .finally(() => setLoading(false));
  }, [videoId]);

  function handleShare() {
    navigator.clipboard.writeText(window.location.href).then(() => { setCopied(true); setTimeout(()=>setCopied(false),2000); });
  }

  const title = details?.snippet?.title || "Watch Movie";

  return (
    <div className="pt-20 pb-16 px-4 max-w-7xl mx-auto">
      <button onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-[hsl(220,10%,55%)] hover:text-white transition-colors mb-4">
        <ChevronLeft className="w-4 h-4" /> Back
      </button>

      {/* Top ad */}
      <div className="mb-6"><AdBanner slot="6789012345" format="horizontal" style={{minHeight:90}} /></div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Player */}
          <div className="relative w-full rounded-2xl overflow-hidden bg-black shadow-2xl shadow-black/60" style={{aspectRatio:"16/9"}}>
            {videoId ? (
              <iframe key={videoId}
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen className="w-full h-full" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[hsl(220,15%,14%)]">
                <Play className="w-16 h-16 text-[hsl(220,10%,40%)]" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="mt-5">
            {loading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-6 bg-[hsl(220,15%,16%)] rounded w-3/4" />
                <div className="h-4 bg-[hsl(220,15%,16%)] rounded w-1/2" />
              </div>
            ) : details ? (
              <>
                <h1 className="text-xl font-bold text-white leading-snug mb-3">{details.snippet.title}</h1>
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[hsl(220,15%,16%)]">
                  <div className="flex flex-wrap items-center gap-4 text-sm text-[hsl(220,10%,50%)]">
                    <span className="font-medium text-[hsl(220,10%,70%)]">{details.snippet.channelTitle}</span>
                    {details.statistics?.viewCount && (
                      <span className="flex items-center gap-1.5"><Eye className="w-4 h-4"/>{formatViewCount(details.statistics.viewCount)} views</span>
                    )}
                    {details.statistics?.likeCount && (
                      <span className="flex items-center gap-1.5"><ThumbsUp className="w-4 h-4"/>{formatViewCount(details.statistics.likeCount)}</span>
                    )}
                    {details.contentDetails?.duration && (
                      <span className="flex items-center gap-1.5"><Clock className="w-4 h-4"/>{formatDuration(details.contentDetails.duration)}</span>
                    )}
                  </div>
                  <button onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(220,15%,16%)] border border-[hsl(220,15%,22%)] hover:border-orange-500/50 text-sm text-white transition-all">
                    <Share2 className="w-4 h-4" />{copied ? "Copied!" : "Share"}
                  </button>
                </div>
                {details.snippet.description && (
                  <div className="mt-4 p-4 rounded-xl bg-[hsl(220,18%,11%)]">
                    <p className="text-sm text-[hsl(220,10%,55%)] leading-relaxed whitespace-pre-wrap line-clamp-5">
                      {details.snippet.description}
                    </p>
                  </div>
                )}
              </>
            ) : null}
          </div>

          {/* Mid ad */}
          <div className="mt-6"><AdBanner slot="7890123456" format="rectangle" style={{minHeight:250}} /></div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-80 xl:w-96 shrink-0">
          {/* Vertical ad */}
          <div className="mb-6"><AdBanner slot="8901234567" format="vertical" style={{minHeight:600}} /></div>

          {/* Related */}
          <h2 className="text-base font-semibold text-white mb-4">Related Movies</h2>
          {loading ? (
            <div className="space-y-3">
              {Array.from({length:6}).map((_,i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-32 h-20 rounded-lg bg-[hsl(220,15%,16%)] shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-3 bg-[hsl(220,15%,16%)] rounded w-full"/>
                    <div className="h-3 bg-[hsl(220,15%,16%)] rounded w-3/4"/>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {related.map(v => <RelatedCard key={v.id.videoId} video={v} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RelatedCard({ video }: { video: YouTubeVideo }) {
  const router = useRouter();
  const thumb = video.snippet.thumbnails.medium?.url;
  return (
    <div onClick={() => router.push(`/watch?id=${video.id.videoId}`)}
      className="flex gap-3 cursor-pointer group rounded-xl p-2 hover:bg-[hsl(220,18%,13%)] transition-all">
      <div className="relative w-32 h-20 rounded-lg overflow-hidden shrink-0 bg-[hsl(220,15%,16%)]">
        <img src={thumb} alt={video.snippet.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
          <Play className="w-5 h-5 text-white fill-white" />
        </div>
      </div>
      <div className="flex-1 min-w-0 py-0.5">
        <p className="text-xs font-medium text-white line-clamp-2 leading-snug group-hover:text-orange-300 transition-colors">{video.snippet.title}</p>
        <p className="text-xs text-[hsl(220,10%,45%)] mt-1.5 truncate">{video.snippet.channelTitle}</p>
      </div>
    </div>
  );
}

export default function WatchPage() {
  return (
    <Suspense fallback={<div className="pt-24 text-center text-white">Loading...</div>}>
      <WatchContent />
    </Suspense>
  );
}
