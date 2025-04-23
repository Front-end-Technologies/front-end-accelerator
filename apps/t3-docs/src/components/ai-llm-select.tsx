import { useThemeStore } from "@/app/store";
import { llm } from "@/lib/const";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

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
    <Select
      onValueChange={(value) => {
        const currentLLM = llm.find((model) => model.name === value);

        if (currentLLM) {
          setAiLLM(currentLLM);
        }
      }}
      value={currentLLM.name}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select AI Model" />
      </SelectTrigger>
      <SelectContent>
        {uniqueProviders.map((provider) => (
          <SelectGroup key={provider}>
            <SelectLabel>{getProviderLabel(provider)}</SelectLabel>
            {llm
              .filter((model) => model.provider === provider)
              .map((model) => (
                <SelectItem key={model.name} value={model.name}>
                  {model.name}
                </SelectItem>
              ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
