import { useEffect, useMemo, useState } from "react";

const API_URL = "https://api.freeapi.app/api/v1/public/youtube/videos";

function formatNumber(value) {
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return "0";
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(numericValue);
}

function formatDuration(duration) {
  const matches = duration?.match(
    /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/,
  );
  if (!matches) return "0:00";

  const hours = Number(matches[4] || 0);
  const minutes = Number(matches[5] || 0);
  const seconds = Number(matches[6] || 0);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function trimText(text, limit) {
  if (!text) return "";
  return text.length > limit ? `${text.slice(0, limit).trim()}...` : text;
}

// 1. Added a Skeleton component for a premium loading experience
const SkeletonCard = () => (
  <article className="overflow-hidden rounded-3xl border border-white/5 bg-white/5 animate-pulse shadow-xl">
    <div className="aspect-video bg-slate-800/50 w-full" />
    <div className="p-5">
      <div className="flex items-start gap-4">
        <div className="h-11 w-11 flex-none rounded-full bg-slate-800/50" />
        <div className="flex-1 space-y-3 py-1">
          <div className="h-4 w-3/4 rounded bg-slate-800/50" />
          <div className="h-3 w-1/2 rounded bg-slate-800/50" />
        </div>
      </div>
      <div className="mt-6 space-y-2">
        <div className="h-3 w-full rounded bg-slate-800/30" />
        <div className="h-3 w-5/6 rounded bg-slate-800/30" />
        <div className="h-3 w-4/6 rounded bg-slate-800/30" />
      </div>
    </div>
  </article>
);

function App() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadVideos() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const result = await response.json();
        const videoRows = result?.data?.data ?? [];
        const normalizedVideos = videoRows
          .map((entry) => entry?.items)
          .filter(Boolean);

        setVideos(normalizedVideos);
      } catch (fetchError) {
        if (fetchError.name !== "AbortError") {
          setError(
            "Videos could not be loaded right now. Check your connection.",
          );
        }
      } finally {
        setLoading(false);
      }
    }

    loadVideos();

    return () => controller.abort();
  }, []);

  const stats = useMemo(() => {
    const totalViews = videos.reduce(
      (sum, video) => sum + Number(video?.statistics?.viewCount || 0),
      0,
    );
    return {
      total: videos.length,
      views: totalViews,
    };
  }, [videos]);

  return (
    <main className="min-h-screen bg-[#08080d] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] px-4 py-10 text-slate-100 sm:px-6 lg:px-8 font-sans selection:bg-orange-500/30">
      {/* Header Section */}
      <section className="mx-auto mb-10 flex max-w-7xl flex-col gap-8 rounded-[2rem] border border-white/5 bg-white/5 p-8 shadow-2xl backdrop-blur-xl lg:flex-row lg:items-end lg:justify-between relative overflow-hidden">
        {/* Subtle background glow for the header */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-orange-400">
            FreeAPI Integration
          </p>
          <h1 className="max-w-[14ch] text-5xl font-black leading-tight sm:text-6xl tracking-tight bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
            Premium Video Feed.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-400">
            A highly polished video browser layout with responsive cards, parsed
            metadata, and smooth hover interactions.
          </p>
        </div>

        <div className="grid min-w-0 grid-cols-2 gap-4 sm:min-w-[320px] relative z-10">
          <article className="rounded-2xl border border-white/5 bg-black/20 p-5 backdrop-blur-md">
            <strong className="block text-4xl font-black text-white">
              {loading ? "-" : stats.total}
            </strong>
            <span className="mt-2 block text-sm font-medium text-slate-400 uppercase tracking-wider">
              Videos
            </span>
          </article>
          <article className="rounded-2xl border border-white/5 bg-black/20 p-5 backdrop-blur-md">
            <strong className="block text-4xl font-black text-white">
              {loading ? "-" : formatNumber(stats.views)}
            </strong>
            <span className="mt-2 block text-sm font-medium text-slate-400 uppercase tracking-wider">
              Total Views
            </span>
          </article>
        </div>
      </section>

      {/* Error State */}
      {error && (
        <section className="mx-auto mb-8 max-w-7xl rounded-2xl border border-red-500/20 bg-red-500/10 p-6 flex items-center gap-4">
          <span className="text-2xl">⚠️</span>
          <div>
            <h2 className="text-lg font-bold text-red-200">System Error</h2>
            <p className="text-red-300/80 text-sm">{error}</p>
          </div>
        </section>
      )}

      {/* Grid Section */}
      <section
        className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
        aria-label="Video listing"
      >
        {/* Loading Skeletons */}
        {loading &&
          [...Array(6)].map((_, index) => (
            <SkeletonCard key={`skeleton-${index}`} />
          ))}

        {/* Video Cards */}
        {!loading &&
          !error &&
          videos.map((video) => {
            const thumbnail =
              video?.snippet?.thumbnails?.maxres?.url ??
              video?.snippet?.thumbnails?.high?.url ??
              video?.snippet?.thumbnails?.medium?.url ??
              video?.snippet?.thumbnails?.default?.url;

            return (
              <article
                key={video.id}
                // 2. Upgraded hover effects: card lifts up, border glows slightly, shadow intensifies
                className="group flex flex-col overflow-hidden rounded-[2rem] border border-white/5 bg-slate-900/40 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:border-white/10 hover:bg-slate-800/60 hover:shadow-2xl hover:shadow-orange-500/5 backdrop-blur-sm"
              >
                <a
                  className="relative block aspect-video overflow-hidden"
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer" // Added noopener for security
                >
                  {/* 3. Image scales up smoothly on hover */}
                  <img
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={thumbnail}
                    alt={video.snippet.title}
                  />

                  {/* 4. Glassmorphism duration badge */}
                  <span className="absolute bottom-4 right-4 rounded-lg bg-black/60 backdrop-blur-md px-2.5 py-1 text-xs font-bold tracking-wider text-white border border-white/10">
                    {formatDuration(video?.contentDetails?.duration)}
                  </span>

                  {/* Play button overlay that appears on hover */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center pointer-events-none">
                    <div className="w-14 h-14 rounded-full bg-orange-500/90 backdrop-blur-sm flex items-center justify-center pl-1 shadow-[0_0_30px_rgba(249,115,22,0.5)] transform scale-75 group-hover:scale-100 transition-transform duration-500">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </a>

                <div className="flex flex-col flex-grow p-6">
                  <div className="flex items-start gap-4">
                    <div className="grid h-12 w-12 flex-none place-items-center rounded-full bg-gradient-to-br from-orange-500 to-rose-600 font-bold text-white shadow-lg border border-white/10">
                      {video.snippet.channelTitle?.slice(0, 1).toUpperCase() ??
                        "V"}
                    </div>
                    <div className="min-w-0 pt-1">
                      <h2 className="truncate text-base font-bold text-white group-hover:text-orange-400 transition-colors duration-300">
                        {video.snippet.title}
                      </h2>
                      <p className="mt-1 text-sm font-medium text-slate-400">
                        {video.snippet.channelTitle}
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 text-sm leading-relaxed text-slate-400 flex-grow">
                    {trimText(
                      video?.snippet?.localized?.description ||
                        video?.snippet?.description,
                      110,
                    )}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold tracking-wide text-slate-300">
                    <span className="rounded-lg border border-white/5 bg-white/5 px-3 py-1.5 backdrop-blur-sm">
                      {formatNumber(video?.statistics?.viewCount)} VIEWS
                    </span>
                    <span className="rounded-lg border border-white/5 bg-white/5 px-3 py-1.5 backdrop-blur-sm">
                      {formatNumber(video?.statistics?.likeCount)} LIKES
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
      </section>

      {/* Empty State */}
      {!loading && !error && videos.length === 0 && (
        <section className="mx-auto mt-12 max-w-xl text-center">
          <p className="text-xl font-semibold text-slate-300">
            No videos found.
          </p>
          <p className="mt-2 text-slate-500">
            The FreeAPI feed might be empty right now.
          </p>
        </section>
      )}
    </main>
  );
}

export default App;
