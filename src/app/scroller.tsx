"use client";

import { useEffect } from "react";

export default function Scroller({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const target = window.location.hash && document.getElementById(window.location.hash.slice(1));
    if (target) {
      const y = target.getBoundingClientRect().top + window.scrollY - 50;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, []);

  return <>{children}</>;
}