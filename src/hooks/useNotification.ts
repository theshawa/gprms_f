import { useCallback, useEffect, useRef, useState } from "react";

export function useNotificationSound(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio(src);

    const unlock = () => {
      audioRef.current?.play().catch(() => {});
      setUnlocked(true);
      window.removeEventListener("click", unlock);
    };

    window.addEventListener("click", unlock);

    return () => {
      window.removeEventListener("click", unlock);
    };
  }, [src]);

  const play = useCallback(() => {
    if (unlocked && audioRef.current) {
      audioRef.current.currentTime = 0; // Reset to start
      audioRef.current.play().catch((error) => {
        console.error("Error playing notification sound:", error);
      });
    }
  }, [unlocked]);

  return play;
}
