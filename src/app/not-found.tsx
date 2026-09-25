import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Page not found | Redux State Demo" };

export default function NotFound() {
  return (
    <main id="main-content" tabIndex={-1} className="panel message-page">
      <p className="eyebrow">404</p>
      <h1>Page not found</h1>
      <p>This page does not exist. Return to the demo to continue exploring.</p>
      <Link className="button-link" href="/">Back to demo</Link>
    </main>
  );
}
