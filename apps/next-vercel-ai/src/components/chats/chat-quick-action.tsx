import { Flame, Zap } from "lucide-react"
import { Button } from "../ui/button"
import { memo, SetStateAction } from "react"
import { QuickAction } from "@/lib/types/quick-action"

type ChatQuickActionsParams = {
    readonly quickActions: QuickAction[]
    readonly setInput: (value: SetStateAction<string>) => void
}

function NonMemoizedChatQuickActions({ quickActions, setInput }: ChatQuickActionsParams) {
    return (
        <div className="mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Flame className={"text-purple-300"} />
          <h4>Try one of these following questions to get started.</h4>
        </div>
        <div className="flex gap-4 pb-2 overflow-x-scroll">
          {quickActions?.map((action, index) => (
            <Button
              key={'quick-action-' + index}
              onClick={() => setInput(action.value)}
              className="bg-purple-300 hover:bg-purple-500 hover:cursor-pointer"
            >
              <Zap />
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    )
}

export const ChatQuickActions = memo(
    NonMemoizedChatQuickActions,
    (prevProps, nextProps) => prevProps.quickActions === nextProps.quickActions,
  );