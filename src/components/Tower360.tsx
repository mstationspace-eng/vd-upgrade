import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { NavLink } from "react-router-dom";
import CanvasOverlay from "./CanvasOverlay";
import CanvasOverlayFrame90 from "./CanvasOverlayFrame90";
import CanvasOverlayFrame181 from "./CanvasOverlayFrame181";

const TOTAL_FRAMES = 362 as const;
const MIN_FRAME = 1 as const;
const MAX_FRAME = 362 as const;
const STOP_FRAMES: number[] = [90, 181, 270, 362];
const THUMBNAIL_FRAMES: number[] = [1, 90, 181, 270];
const PNG_FRAMES: Set<number> = new Set([1, 90, 181, 270, 362]);

function wrapFrame(frame: number): number {
  if (frame < MIN_FRAME)
    return MAX_FRAME - ((MIN_FRAME - frame - 1) % TOTAL_FRAMES);
  if (frame > MAX_FRAME)
    return MIN_FRAME + ((frame - MAX_FRAME - 1) % TOTAL_FRAMES);
  return frame;
}

function pad4(num: number): string {
  return num.toString().padStart(4, "0");
}

type DragState = {
  startX: number;
  lastX: number;
  startFrame: number;
};

type AnimState = {
  raf: number;
  target: number;
};

export default function Tower360(): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const getInitialFrame = (): number => {
    const savedFrame = sessionStorage.getItem("lastTowerFrame");
    return savedFrame ? parseInt(savedFrame, 10) : 1;
  };

  const [currentFrame, setCurrentFrame] = useState<number>(getInitialFrame);

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStateRef = useRef<DragState>({
    startX: 0,
    lastX: 0,
    startFrame: 1,
  });
  const animRef = useRef<AnimState>({ raf: 0, target: 1 });
  const imageRef = useRef<HTMLImageElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    sessionStorage.setItem("lastTowerFrame", currentFrame.toString());
  }, [currentFrame]);

  const frameUrl = useCallback((frame: number): string => {
    const ext = PNG_FRAMES.has(frame) ? "png" : "jpg";
    return `/tower-2/${pad4(frame)}.${ext}`;
  }, []);

  useEffect(() => {
    const preloadAllImages = async () => {
      const imagePromises = [];
      for (let i = MIN_FRAME; i <= MAX_FRAME; i++) {
        imagePromises.push(
          new Promise((resolve, reject) => {
            const img = new Image();
            img.src = frameUrl(i);
            img.onload = resolve;
            img.onerror = reject;
          })
        );
      }
      try {
        await Promise.all(imagePromises);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load images:", error);
        setIsLoading(false);
      }
    };
    preloadAllImages();
  }, [frameUrl]);

  const animateToFrame = useCallback(
    (target: number): void => {
      const start = currentFrame;
      const forwardDist =
        target >= start ? target - start : TOTAL_FRAMES - (start - target);
      const backwardDist =
        start >= target ? start - target : TOTAL_FRAMES - (target - start);
      const step = forwardDist <= backwardDist ? 1 : -1;

      if (animRef.current.raf) cancelAnimationFrame(animRef.current.raf);
      animRef.current.target = target;

      const tick = () => {
        let reached = false;
        setCurrentFrame((prev) => {
          if (prev === animRef.current.target) {
            reached = true;
            return prev;
          }
          const next = wrapFrame(prev + step);
          if (next === animRef.current.target) {
            reached = true;
          }
          return next;
        });
        if (reached) {
          if (animRef.current.raf) cancelAnimationFrame(animRef.current.raf);
          animRef.current.raf = 0;
          return;
        }
        animRef.current.raf = requestAnimationFrame(tick);
      };
      animRef.current.raf = requestAnimationFrame(tick);
    },
    [currentFrame]
  );

  const advanceToNextStop = useCallback(
    (direction: 1 | -1): void => {
      const from = currentFrame;
      const ALL_STOPS: number[] = THUMBNAIL_FRAMES;
      let target: number;
      if (direction > 0) {
        const nextStops = ALL_STOPS.filter((s) => s > from);
        target = nextStops.length ? nextStops[0] : ALL_STOPS[0];
      } else {
        const prevStops = ALL_STOPS.filter((s) => s < from);
        target = prevStops.length
          ? prevStops[prevStops.length - 1]
          : ALL_STOPS[ALL_STOPS.length - 1];
      }
      animateToFrame(target);
    },
    [currentFrame, animateToFrame]
  );

  const getClientXFromPointer = (e: PointerEvent): number => e.clientX;
  const getClientXFromTouch = (e: TouchEvent): number =>
    e.touches?.[0]?.clientX ?? 0;
  const getChangedClientXFromTouch = (e: TouchEvent): number =>
    e.changedTouches?.[0]?.clientX ?? 0;

  useEffect(() => {
    const el = containerRef.current;
    if (isLoading || !el) {
      return;
    }

    const DRAG_SENSITIVITY_PX_PER_FRAME = 8;

    const onPointerDown = (e: PointerEvent) => {
      if (
        e.target instanceof HTMLElement &&
        e.target.closest('[data-nodrag="true"]')
      ) {
        return;
      }
      setIsDragging(true);
      dragStateRef.current = {
        startX: getClientXFromPointer(e),
        lastX: getClientXFromPointer(e),
        startFrame: currentFrame,
      };
      (el as any).setPointerCapture?.(e.pointerId ?? 0);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (
        e.target instanceof HTMLElement &&
        e.target.closest('[data-nodrag="true"]')
      ) {
        return;
      }
      setIsDragging(true);
      dragStateRef.current = {
        startX: getClientXFromTouch(e),
        lastX: getClientXFromTouch(e),
        startFrame: currentFrame,
      };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const x = getClientXFromPointer(e) ?? dragStateRef.current.lastX;
      const deltaX = x - dragStateRef.current.startX;
      const deltaFrames = -Math.round(deltaX / DRAG_SENSITIVITY_PX_PER_FRAME);
      let next = wrapFrame(dragStateRef.current.startFrame + deltaFrames);
      setCurrentFrame(next);
      dragStateRef.current.lastX = x;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const x = getClientXFromTouch(e) ?? dragStateRef.current.lastX;
      const deltaX = x - dragStateRef.current.startX;
      const deltaFrames = -Math.round(deltaX / DRAG_SENSITIVITY_PX_PER_FRAME);
      let next = wrapFrame(dragStateRef.current.startFrame + deltaFrames);
      setCurrentFrame(next);
      dragStateRef.current.lastX = x;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDragging) return;
      setIsDragging(false);
      const endX = getClientXFromPointer(e) ?? dragStateRef.current.lastX;
      const moved = endX - dragStateRef.current.startX;
      if (moved === 0) return;
      advanceToNextStop(moved < 0 ? 1 : -1);
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!isDragging) return;
      setIsDragging(false);
      const endX = getChangedClientXFromTouch(e) ?? dragStateRef.current.lastX;
      const moved = endX - dragStateRef.current.startX;
      if (moved === 0) return;
      advanceToNextStop(moved < 0 ? 1 : -1);
    };

    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [currentFrame, isDragging, advanceToNextStop, isLoading]);

  useEffect(() => {
    return () => {
      if (animRef.current.raf) cancelAnimationFrame(animRef.current.raf);
    };
  }, []);

  const preloadFrames: number[] = useMemo(() => {
    const neighbors = 5;
    const frames = new Set<number>([currentFrame]);
    for (let i = 1; i <= neighbors; i += 1) {
      frames.add(wrapFrame(currentFrame + i));
      frames.add(wrapFrame(currentFrame - i));
    }
    return Array.from(frames);
  }, [currentFrame]);

  const onClickThumbnail = useCallback(
    (frame: number): void => {
      animateToFrame(frame);
    },
    [animateToFrame]
  );

  const goNext = useCallback(() => advanceToNextStop(1), [advanceToNextStop]);
  const goPrev = useCallback(() => advanceToNextStop(-1), [advanceToNextStop]);

  if (isLoading) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div
      className="relative h-screen w-screen bg-black text-white"
      ref={containerRef}
    >
      <div data-nodrag="true" className="absolute top-4 left-4 z-50">
        <NavLink to="/">
          <button
            className="rounded-full bg-white/20 px-3 py-2 text-xl hover:bg-white/40"
            aria-label="Back"
          >
            ←
          </button>
        </NavLink>
      </div>

      <img
        ref={imageRef}
        key={currentFrame}
        src={frameUrl(currentFrame)}
        alt={`Tower frame ${pad4(currentFrame)}`}
        className="h-full w-full object-fill object-center will-change-transform transition-transform duration-300 ease-out"
        style={{ transform: "translateZ(0)" }}
        draggable={false}
      />

      {currentFrame === 1 && (
        <CanvasOverlay imageRef={imageRef} currentFrame={currentFrame} />
      )}
      {currentFrame === 181 && (
        <CanvasOverlayFrame181
          imageRef={imageRef}
          currentFrame={currentFrame}
        />
      )}

      <div className="invisible h-0 w-0 overflow-hidden">
        {preloadFrames.map((f) => (
          <img
            key={`preload-${f}`}
            src={frameUrl(f)}
            alt=""
            aria-hidden="true"
          />
        ))}
      </div>

      <div
        data-nodrag="true"
        className="pointer-events-auto absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 rounded-xl bg-black/50 p-2 backdrop-blur"
      >
        <button
          onClick={goPrev}
          className="rounded-full bg-white/10 px-3 py-2 text-lg leading-none hover:bg-white/20"
          aria-label="Previous"
        >
          ←
        </button>

        <div className="flex items-center justify-center gap-3">
          {THUMBNAIL_FRAMES.map((f) => {
            const isActive = currentFrame === f;
            return (
              <button
                key={`thumb-${f}`}
                onClick={() => onClickThumbnail(f)}
                className={`relative h-16 w-24 overflow-hidden rounded-md border transition-[border-color,transform] duration-200 ${
                  isActive
                    ? "border-white"
                    : "border-white/30 hover:border-white/60"
                } ${isActive ? "scale-105" : "scale-100"}`}
              >
                <img
                  src={frameUrl(f)}
                  alt={`Thumbnail ${pad4(f)}`}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </button>
            );
          })}
        </div>

        <button
          onClick={goNext}
          className="rounded-full bg-white/10 px-3 py-2 text-lg leading-none hover:bg-white/20"
          aria-label="Next"
        >
          →
        </button>
      </div>
    </div>
  );
}
