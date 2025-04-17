import { SidebarTrigger } from "@/components/ui/sidebar";
import EmptyChat from "@/components/chats/empty-chat";

export default function Home() {

  return (
    <>
      <div className="flex items-center gap-4 mb-4">
        <SidebarTrigger className="h-8 w-8" variant="outline" />
        <h1 className="text-2xl font-bold">
          Frontend Accelerator Nextjs Vercel AI
        </h1>
      </div>
      <div className="h-full flex items-center justify-center">
        <EmptyChat />
      </div>
    </>
  );
}
