import { Separator } from "@radix-ui/react-dropdown-menu";

import { HorizontalTimeline } from "~/components/horizontal-timeline";
import VerticalTimeline from "~/components/vertical-timeline";

export default function Timeline() {
  return (
    <section className="flex flex-col space-y-16">
      <div className="space-y-8">
        <h1 className="text-xl font-semibold">Horizontal timeline</h1>
        <HorizontalTimeline />
      </div>

      <div className="space-y-8">
        <h1 className="text-xl font-semibold">Vertical timeline</h1>
        <VerticalTimeline />
      </div>
    </section>
  );
}
