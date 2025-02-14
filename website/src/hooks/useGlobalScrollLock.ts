// hooks/useGlobalScrollLock.ts
import { useState, useCallback } from "react";

export const useGlobalScrollLock = () => {
  const [isLocked, setIsLocked] = useState(false);

  const lockScroll = useCallback(() => {
    setIsLocked(true);
    document.body.style.overflow = "hidden";
  }, []);

  const unlockScroll = useCallback(() => {
    setIsLocked(false);
    document.body.style.overflow = "";
  }, []);

  return { isLocked, lockScroll, unlockScroll };
};
