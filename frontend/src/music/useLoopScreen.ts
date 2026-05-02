import { useEffect } from "react";
import { useAudio } from "./AudioProvider";
import type { LoopType } from "./AudioTypes";

/**
 * Convenience hook for a screen/page that should play a specific BGM loop
 * while mounted, and stop it when unmounted (or hand off to the next screen).
 *
 * Usage:
 *   function HomeScreen() {
 *     useLoopScreen("home");
 *     ...
 *   }
 */
export function useLoopScreen(loop: LoopType): void {
  const { playLoop, isReady, isUnlocked } = useAudio();

  useEffect(() => {
    if (isReady && isUnlocked) {
      playLoop(loop);
    }
  }, [loop, isReady, isUnlocked, playLoop]);
}
