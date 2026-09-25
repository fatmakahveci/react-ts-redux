"use client";

import { useEffect, useRef } from "react";

export default function ErrorPage({ retry }: { retry: () => void }) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus(); }, []);

  return (
    <main id="main-content" tabIndex={-1} className="panel message-page">
      <h1 ref={heading} tabIndex={-1}>The demo could not load</h1>
      <p>Try again to start a fresh demo session.</p>
      <button type="button" onClick={retry}>Try again</button>
    </main>
  );
}
