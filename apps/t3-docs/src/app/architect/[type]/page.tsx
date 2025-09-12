import React from "react";

export default async function ArchitectPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  return (
    <div className="container mx-auto">
      <picture>
        <img alt="SPA logo" src={`/architect/${type}.png`} />
      </picture>
    </div>
  );
}
