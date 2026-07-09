import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface GalleryImage {
  label: string;
  sub: string;
  gradient: string;
}

interface Props {
  images: GalleryImage[];
  /** How many panels to show in the on-page bento grid (1 big + the rest small). Extra images are still browsable in the lightbox. Ignored when layout="grid". */
  visibleCount?: number;
  /** "bento" (default): 1 large tile + small tiles, with a "+N more" overlay for anything past visibleCount.
   *  "grid": every image shown at equal size in a uniform responsive grid (e.g. 6 or 9 tiles), no overflow tile. */
  layout?: "bento" | "grid";
}

function ExpandIcon({ small }: { small?: boolean }) {
  const size = small ? 14 : 16;
  return (
    <div
      className="absolute top-3 right-3 flex items-center justify-center rounded-full bg-black/35 backdrop-blur-sm transition-colors group-hover:bg-black/55"
      style={{ width: size + 18, height: size + 18 }}
    >
      <Maximize2 size={size} color="white" strokeWidth={2} />
    </div>
  );
}

export default function PackageGallery({ images, visibleCount = 3, layout = "bento" }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const prev = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }, [images.length]);
  const next = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i + 1) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (activeIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [activeIndex, close, prev, next]);

  if (images.length === 0) return null;

  const visible = images.slice(0, Math.max(1, visibleCount));
  const big = visible[0];
  const rest = visible.slice(1);
  const extraCount = images.length - visible.length;
  const active = activeIndex !== null ? images[activeIndex] : null;

  return (
    <>
      {layout === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <button
              type="button"
              key={img.label}
              onClick={() => setActiveIndex(i)}
              aria-label={`View ${img.label} photo`}
              className="group relative aspect-4/3 rounded-2xl overflow-hidden text-left cursor-pointer"
            >
              <div className="absolute inset-0" style={{ background: img.gradient }} />
              <div className="absolute inset-0 diagonal-lines" />
              <div className="absolute inset-0 transition-colors group-hover:bg-black/15" />
              <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-end">
                <h3 className="text-sm sm:text-base font-black text-white leading-tight">{img.label}</h3>
                <p className="text-white/60 text-xs mt-0.5">{img.sub}</p>
              </div>
              <ExpandIcon small />
            </button>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:grid-rows-2 lg:h-100">
          <button
            type="button"
            onClick={() => setActiveIndex(0)}
            aria-label={`View ${big.label} photo`}
            className="group relative h-64 lg:h-auto rounded-2xl overflow-hidden lg:col-span-2 lg:row-span-2 text-left cursor-pointer"
          >
            <div className="absolute inset-0" style={{ background: big.gradient }} />
            <div className="absolute inset-0 diagonal-lines" />
            <div className="absolute inset-0 transition-colors group-hover:bg-black/15" />
            <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-end">
              <h3 className="text-2xl lg:text-3xl font-black text-white leading-tight">{big.label}</h3>
              <p className="text-white/60 text-sm mt-1">{big.sub}</p>
            </div>
            <ExpandIcon />
          </button>

          {rest.map((stop, i) => {
            const isLast = i === rest.length - 1;
            return (
              <button
                type="button"
                key={stop.label}
                onClick={() => setActiveIndex(i + 1)}
                aria-label={
                  isLast && extraCount > 0
                    ? `View all ${images.length} photos`
                    : `View ${stop.label} photo`
                }
                className="group relative h-44 lg:h-auto rounded-2xl overflow-hidden text-left cursor-pointer"
              >
                <div className="absolute inset-0" style={{ background: stop.gradient }} />
                <div className="absolute inset-0 diagonal-lines" />
                <div className="absolute inset-0 transition-colors group-hover:bg-black/15" />
                {isLast && extraCount > 0 ? (
                  <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center">
                    <span className="text-white text-xl font-black">+{extraCount}</span>
                    <span className="text-white/70 text-xs font-bold uppercase tracking-widest">more photos</span>
                  </div>
                ) : (
                  <>
                    <div className="absolute inset-0 p-4 lg:p-5 flex flex-col justify-end">
                      <h3 className="text-sm lg:text-base font-black text-white leading-tight">{stop.label}</h3>
                      <p className="text-white/60 text-xs mt-0.5">{stop.sub}</p>
                    </div>
                    <ExpandIcon small />
                  </>
                )}
              </button>
            );
          })}
        </div>
      )}

      {active && (
        <div
          className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/90 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`${active.label} photo gallery`}
          onClick={close}
        >
          {/* Close */}
          <button
            type="button"
            onClick={close}
            aria-label="Close gallery"
            className="absolute z-20 top-4 right-4 sm:top-5 sm:right-5 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition-colors text-white"
          >
            <X size={18} strokeWidth={2.5} />
          </button>

          {/* Prev */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous photo"
              className="absolute z-20 left-1 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition-colors text-white"
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>
          )}

          {/* Next */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next photo"
              className="absolute z-20 right-1 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition-colors text-white"
            >
              <ChevronRight size={20} strokeWidth={2.5} />
            </button>
          )}

          {/* Main image */}
          <div
            className="relative w-full max-w-4xl aspect-16/10 rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0" style={{ background: active.gradient }} />
            <div className="absolute inset-0 diagonal-lines" />
            <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end">
              <h3 className="text-2xl sm:text-3xl font-black text-white">{active.label}</h3>
              <p className="text-white/60 mt-1">{active.sub}</p>
            </div>
          </div>

          {/* Counter + thumbnails */}
          <div className="absolute z-20 bottom-3 sm:bottom-5 left-0 right-0 flex flex-col items-center gap-3 px-4" onClick={(e) => e.stopPropagation()}>
            <span className="text-white/70 text-xs font-bold uppercase tracking-widest">
              {activeIndex! + 1} / {images.length}
            </span>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto max-w-full">
                {images.map((img, i) => (
                  <button
                    type="button"
                    key={img.label}
                    onClick={() => setActiveIndex(i)}
                    aria-label={`Go to ${img.label} photo`}
                    className={`shrink-0 w-14 h-9 rounded-md overflow-hidden border-2 transition-opacity ${
                      i === activeIndex ? "border-yellow opacity-100" : "border-transparent opacity-50 hover:opacity-80"
                    }`}
                  >
                    <div className="w-full h-full" style={{ background: img.gradient }} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
