import { useThemeStore } from "@/app/store";
import { llm, mcps } from "@/lib/const";
import { cn } from "@/lib/utils";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function AiMcpSelect() {
  const currentMcpClient = useThemeStore((state) => state.ai.mcp);
  const setAiMcp = useThemeStore((state) => state.setAiMcp);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{currentMcpClient.name}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {mcps.map((mcpClient) => (
          <div key={mcpClient.name}>
            <DropdownMenuGroup>
              <DropdownMenuLabel>{mcpClient.provider}</DropdownMenuLabel>

              <DropdownMenuCheckboxItem
                checked={currentMcpClient.name === mcpClient.name}
                className={cn(
                  "flex flex-col items-start justify-center gap-1",
                  {
                    "bg-muted": currentMcpClient.name === mcpClient.name,
                  },
                )}
                key={mcpClient.name}
                onCheckedChange={() => setAiMcp(mcpClient)}
              >
                <p className="font-bold">{mcpClient.name}</p>
                <p className="text-muted-foreground text-xs italic">
                  {mcpClient.description}
                </p>
              </DropdownMenuCheckboxItem>
            </DropdownMenuGroup>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
