import React from "react";

type ArchitectPageProps = {
  params: {
    type: string;
  };
};

export const ArchitectPage = async ({ params }: ArchitectPageProps) => {
  return (
    <div className="container mx-auto">
      <picture>
        <img alt="SPA logo" src={`/architect/${params.type}.png`} />
      </picture>
    </div>
  );
};

export default ArchitectPage;
