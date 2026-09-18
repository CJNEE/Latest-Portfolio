import { useState, useRef, useCallback } from 'react';

interface UseLongPressOptions {
  threshold?: number; // ms to trigger (default 5000)
  onStart?: () => void;
  onFinish: () => void;
  onCancel?: () => void;
}

export const useLongPress = ({
  threshold = 5000,
  onStart,
  onFinish,
  onCancel,
}: UseLongPressOptions) => {
  const [progress, setProgress] = useState(0); // 0 to 1
  const [isPressing, setIsPressing] = useState(false);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  const clear = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (animFrameRef.current) {
      window.cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setIsPressing(false);
    setProgress(0);
  }, []);

  const start = useCallback(() => {
    clear();
    setIsPressing(true);
    startTimeRef.current = Date.now();
    if (onStart) onStart();

    const updateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const currentProgress = Math.min(elapsed / threshold, 1);
      setProgress(currentProgress);

      if (currentProgress < 1) {
        animFrameRef.current = window.requestAnimationFrame(updateProgress);
      }
    };
    animFrameRef.current = window.requestAnimationFrame(updateProgress);

    timerRef.current = window.setTimeout(() => {
      clear();
      onFinish();
    }, threshold);
  }, [clear, threshold, onStart, onFinish]);

  const cancel = useCallback(() => {
    if (isPressing) {
      clear();
      if (onCancel) onCancel();
    }
  }, [clear, isPressing, onCancel]);

  return {
    handlers: {
      onMouseDown: start,
      onMouseUp: cancel,
      onMouseLeave: cancel,
      onTouchStart: start,
      onTouchEnd: cancel,
    },
    progress,
    isPressing,
  };
};
