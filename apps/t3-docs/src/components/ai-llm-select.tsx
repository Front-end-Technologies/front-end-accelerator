import { useThemeStore } from "@/app/store";
import { llm } from "@/lib/const";
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

const getProviderLabel = (provider: string) => {
  switch (provider) {
    case "anthropic":
      return "Anthropic";
    case "google":
      return "Google";
    case "openai":
      return "OpenAI";
    default:
      return provider;
  }
};

export function AiLLMSelect() {
  const uniqueProviders = Array.from(
    new Set(llm.map((model) => model.provider)),
  );

  const currentLLM = useThemeStore((state) => state.ai.llm);
  const setAiLLM = useThemeStore((state) => state.setAiLLM);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{currentLLM?.name}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {uniqueProviders.map((provider) => (
          <div key={provider}>
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                {getProviderLabel(provider)}
              </DropdownMenuLabel>
              {llm
                .filter((model) => model.provider === provider)
                .map((model) => (
                  <DropdownMenuCheckboxItem
                    checked={currentLLM.name === model.name}
                    className={cn(
                      "flex flex-col items-start justify-center gap-1",
                      {
                        "bg-muted": currentLLM.name === model.name,
                      },
                    )}
                    key={model.name}
                    onCheckedChange={() => setAiLLM(model)}
                  >
                    <p className="font-bold">{model.name}</p>
                    <p className="text-muted-foreground text-xs italic">
                      {model.description}
                    </p>
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuGroup>
            {uniqueProviders.indexOf(provider) !==
              uniqueProviders.length - 1 && <DropdownMenuSeparator />}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
