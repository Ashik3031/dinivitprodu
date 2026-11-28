import { useEffect, useRef, useState, useCallback, RefObject } from 'react';

interface UseAutoScrollOptions {
  enabled: boolean;
  speedPxPerSec?: number;
  initialDelaySeconds?: number;
  isBlocked?: boolean; // e.g., when opening cover or modal is open
  containerRef: RefObject<HTMLElement | null>;
}

interface UseAutoScrollReturn {
  isAutoScrolling: boolean;
  isPausedByUser: boolean;
  hasReachedEnd: boolean;
  pause: () => void;
  resume: () => void;
  toggle: () => void;
}

/**
 * Finds the nearest scrollable ancestor element; falls back to window scrolling.
 */
function findScrollContainer(el: HTMLElement | null): HTMLElement | Window {
  if (typeof window === 'undefined') return null as any;
  let current: HTMLElement | null = el?.parentElement || null;
  while (current) {
    const style = window.getComputedStyle(current);
    const overflowY = style.overflowY;
    if ((overflowY === 'auto' || overflowY === 'scroll') && current.scrollHeight > current.clientHeight) {
      return current;
    }
    current = current.parentElement;
  }
  return window;
}

function getScrollTop(target: HTMLElement | Window): number {
  if (target === window) {
    return window.scrollY || document.documentElement.scrollTop || 0;
  }
  return (target as HTMLElement).scrollTop;
}

function getMaxScrollTop(target: HTMLElement | Window): number {
  if (target === window) {
    const doc = document.documentElement;
    return Math.max(0, doc.scrollHeight - window.innerHeight);
  }
  const el = target as HTMLElement;
  return Math.max(0, el.scrollHeight - el.clientHeight);
}

function setScrollTop(target: HTMLElement | Window, top: number): void {
  if (target === window) {
    window.scrollTo({ top, behavior: 'auto' });
  } else {
    (target as HTMLElement).scrollTop = top;
  }
}

/**
 * Smooth requestAnimationFrame auto-scroll engine that:
 * - Respects initial delay and configurable speed (px/sec)
 * - Stops cleanly at the bottom of the last page
 * - Immediately pauses on any manual user scroll/touch/wheel/key interaction
 * - Never restarts unexpectedly or pulls the visitor back after interruption
 * - Allows manual pause & resume from current position
 */
export function useAutoScroll({
  enabled,
  speedPxPerSec = 30,
  initialDelaySeconds = 2,
  isBlocked = false,
  containerRef
}: UseAutoScrollOptions): UseAutoScrollReturn {
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [isPausedByUser, setIsPausedByUser] = useState(false);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);

  const rafRef = useRef<number | null>(null);
  const delayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const virtualScrollYRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number | null>(null);
  const lastProgrammaticYRef = useRef<number | null>(null);
  const isRunningRef = useRef<boolean>(false);

  const stopLoop = useCallback(() => {
    isRunningRef.current = false;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (delayTimerRef.current !== null) {
      clearTimeout(delayTimerRef.current);
      delayTimerRef.current = null;
    }
    lastFrameTimeRef.current = null;
    setIsAutoScrolling(false);
  }, []);

  const startScrollingLoop = useCallback(() => {
    if (!enabled || isBlocked) return;
    const target = findScrollContainer(containerRef.current);
    if (!target) return;

    const maxScroll = getMaxScrollTop(target);
    const currentY = getScrollTop(target);
    if (maxScroll <= 2 || currentY >= maxScroll - 2) {
      setHasReachedEnd(true);
      stopLoop();
      return;
    }

    stopLoop();
    isRunningRef.current = true;
    setIsAutoScrolling(true);
    setIsPausedByUser(false);
    setHasReachedEnd(false);
    virtualScrollYRef.current = currentY;
    lastProgrammaticYRef.current = currentY;
    lastFrameTimeRef.current = performance.now();

    const safeSpeed = Math.max(8, Math.min(180, speedPxPerSec || 30));

    const step = (now: number) => {
      if (!isRunningRef.current) return;

      const activeTarget = findScrollContainer(containerRef.current);
      const currentActualY = getScrollTop(activeTarget);
      const maxY = getMaxScrollTop(activeTarget);

      // If user or external script moved scroll position significantly, pause immediately
      // and never pull the visitor back.
      if (
        lastProgrammaticYRef.current !== null &&
        Math.abs(currentActualY - lastProgrammaticYRef.current) > 6
      ) {
        setIsPausedByUser(true);
        stopLoop();
        return;
      }

      if (currentActualY >= maxY - 1 || maxY <= 0) {
        setHasReachedEnd(true);
        stopLoop();
        return;
      }

      const prevTime = lastFrameTimeRef.current ?? now;
      const dt = Math.min(0.05, Math.max(0, (now - prevTime) / 1000));
      lastFrameTimeRef.current = now;

      virtualScrollYRef.current = Math.min(maxY, virtualScrollYRef.current + safeSpeed * dt);
      setScrollTop(activeTarget, virtualScrollYRef.current);
      lastProgrammaticYRef.current = getScrollTop(activeTarget);

      if (virtualScrollYRef.current >= maxY - 1) {
        setHasReachedEnd(true);
        stopLoop();
        return;
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
  }, [enabled, isBlocked, speedPxPerSec, containerRef, stopLoop]);

  const pause = useCallback(() => {
    setIsPausedByUser(true);
    stopLoop();
  }, [stopLoop]);

  const resume = useCallback(() => {
    if (!enabled || isBlocked) return;
    const target = findScrollContainer(containerRef.current);
    const maxY = getMaxScrollTop(target);
    const currentY = getScrollTop(target);

    // If visitor already reached the bottom and explicitly clicks resume/replay,
    // smoothly start again from top; otherwise continue from their current position.
    if (currentY >= maxY - 4 && maxY > 10) {
      setScrollTop(target, 0);
      virtualScrollYRef.current = 0;
    }

    setIsPausedByUser(false);
    setHasReachedEnd(false);
    startScrollingLoop();
  }, [enabled, isBlocked, containerRef, startScrollingLoop]);

  const toggle = useCallback(() => {
    if (isAutoScrolling) {
      pause();
    } else {
      resume();
    }
  }, [isAutoScrolling, pause, resume]);

  // Schedule initial auto-scroll start when enabled and unblocked
  useEffect(() => {
    stopLoop();
    if (!enabled || isBlocked) {
      return;
    }
    if (isPausedByUser) {
      return;
    }

    const delayMs = Math.max(0, (initialDelaySeconds ?? 2) * 1000);
    delayTimerRef.current = setTimeout(() => {
      startScrollingLoop();
    }, delayMs);

    return () => {
      stopLoop();
    };
  }, [enabled, isBlocked, initialDelaySeconds, speedPxPerSec, isPausedByUser, startScrollingLoop, stopLoop]);

  // Interrupt auto-scroll on any manual visitor interaction
  useEffect(() => {
    if (!enabled || isBlocked) return;

    const handleUserInterrupt = (e: Event) => {
      const targetEl = e.target as HTMLElement | null;
      if (targetEl?.closest?.('[data-autoscroll-control="true"]')) {
        return;
      }
      if (delayTimerRef.current !== null || isRunningRef.current) {
        setIsPausedByUser(true);
        stopLoop();
      }
    };

    const handleKeyInterrupt = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) {
        handleUserInterrupt(e);
      }
    };

    window.addEventListener('wheel', handleUserInterrupt, { passive: true });
    window.addEventListener('touchstart', handleUserInterrupt, { passive: true });
    window.addEventListener('pointerdown', handleUserInterrupt, { passive: true });
    window.addEventListener('keydown', handleKeyInterrupt, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleUserInterrupt);
      window.removeEventListener('touchstart', handleUserInterrupt);
      window.removeEventListener('pointerdown', handleUserInterrupt);
      window.removeEventListener('keydown', handleKeyInterrupt);
    };
  }, [enabled, isBlocked, stopLoop]);

  return {
    isAutoScrolling,
    isPausedByUser,
    hasReachedEnd,
    pause,
    resume,
    toggle
  };
}
