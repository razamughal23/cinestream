"use client";
import { useEffect, useRef } from "react";

declare global { interface Window { adsbygoogle: unknown[] } }

export default function AdBanner({ slot, format = "auto", style }: { slot: string; format?: string; style?: React.CSSProperties }) {
  const pushed = useRef(false);
  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch {}
  }, []);
  return (
    <div className="overflow-hidden w-full" style={style}>
      <ins className="adsbygoogle" style={{ display: "block", ...style }}
        data-ad-client="ca-pub-1123659213929990"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true" />
    </div>
  );
}
