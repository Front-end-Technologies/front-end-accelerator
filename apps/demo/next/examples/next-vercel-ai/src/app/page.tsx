import ChatEmpty from "@/components/chats/chat-empty";
import ChatRoot from "@/components/chats/chat-root";
import { Card } from "@/components/ui/card";

export default function Home() {

  return (


    <ChatRoot>
      <Card className="flex-1 overflow-y-auto flex flex-col mb-4">
        <div className="flex-1 p-4">
          <div className="h-full flex items-center justify-center">
            <ChatEmpty />
          </div>
        </div>
      </Card>
    </ChatRoot>
  );
}
