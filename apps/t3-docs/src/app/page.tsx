import { Footer } from "@/components/footer";
import { api, HydrateClient } from "@/trpc/server";

import Contributors from "./contributors";

export default async function Home() {
  await api.gitHub.getMembers.prefetch();

  return (
    <div
      className="scrollbar-hide flex flex-col gap-8 overflow-auto p-4"
      style={{ height: "calc(100vh - 5rem)" }}
    >
      <p>
        Our mission is to accelerate frontend development by offering a robust
        suite of tools and best practices. By simplifying workflows, we empower
        developers to create high-quality applications with greater speed and
        efficiency.
      </p>

      <p>
        We are always excited to welcome new members and contributors to our
        team. Front-end enthusiasts of all skill levels and experiences are
        encouraged to join us!
      </p>

      <HydrateClient>
        <Contributors />
      </HydrateClient>

      <div className="my-16">
        <Footer />
      </div>
    </div>
  );
}
