"use client";

// Adds the "in-view" class once the element scrolls into view, so animations
// inside it start when people can actually see them.

import { useEffect, useRef, useState } from "react";

export default function InView({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setSeen(true);
        io.disconnect();
      }
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <div ref={ref} className={`${className ?? ""} ${seen ? "in-view" : ""}`}>{children}</div>;
}
