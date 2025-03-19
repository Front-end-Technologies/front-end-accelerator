"use client";

import Script from "next/script";

export default function Home() {
  // only use HydrateClient when prefetching data
  // prefetch some data here just for demonstration

  return (
    <>
      <Script src="/dist/assets/index.js" />
      <h1>Dashboard</h1>

      <button className="atlas_button"> test</button>
    </>
  );
}
