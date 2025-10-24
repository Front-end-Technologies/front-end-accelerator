import { Footer } from "@/components/footer";
import { api } from "@/trpc/server";

import Contributors from "./contributors";

export default async function Home() {
  await api.gitHub.getMembers.prefetch();

  return (
    <div
      className="scrollbar-hide flex flex-col gap-8 overflow-auto p-4"
      style={{ height: "calc(100vh - 5rem)" }}
    >
      <p>
        We are always excited to welcome new members and contributors to our
        team. Front-end enthusiasts of all skill levels and experiences are
        encouraged to join us! Don&apos;t forget to join our Teams and Slack
        Community for collaboration and support. Many thanks goes out to our
        sponsor, Cegeka Applications Global.
      </p>

      <Contributors />

      <div className="my-16">
        <Footer />
      </div>
    </div>
  );
}
