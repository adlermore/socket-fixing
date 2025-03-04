"use client";

import { useEffect } from "react";

interface UseOnClickOutsideProps {
  ref: React.RefObject<HTMLElement | null>;
  handler: (event: MouseEvent | TouchEvent) => void;
}

const useOnClickOutside = ({ ref, handler }: UseOnClickOutsideProps) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (
        !ref.current ||
        ref.current.contains(event.target as Node) ||
        (event.target as Element).nodeName === "path"
      ) {
        return;
      }
      handler(event);
    };

    document.addEventListener("mousedown", listener as EventListener);
    document.addEventListener("touchstart", listener as EventListener);

    return () => {
      document.removeEventListener("mousedown", listener as EventListener);
      document.removeEventListener("touchstart", listener as EventListener);
    };
  }, [ref, handler]);
};

export default useOnClickOutside;
