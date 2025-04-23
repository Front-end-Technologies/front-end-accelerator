import { useThemeStore } from "@/app/store";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function FrameworkSelect() {
  const setOutputFramework = useThemeStore(
    (state) => state.setAiOutputFramework,
  );
  const framework = useThemeStore((state) => state.ai.framework.output);

  return (
    <Select onValueChange={setOutputFramework} value={framework}>
      <SelectTrigger>
        <SelectValue placeholder="Select framework" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="react">
          <div className="flex items-center gap-3">
            <picture>
              <img
                alt={`${framework} logo`}
                className="h-6 w-6"
                src="/react-logo.svg"
              />
            </picture>
            <span>React</span>
          </div>
        </SelectItem>
        <SelectItem value="angular">
          <div className="flex items-center gap-3">
            <picture>
              <img
                alt="angular logo"
                className="h-6 w-6"
                src="/angular-logo.svg"
              />
            </picture>
            <span>Angular</span>
          </div>
        </SelectItem>
        <SelectItem value="vue">
          <div className="flex items-center gap-3">
            <picture>
              <img alt="vue logo" className="h-6 w-6" src="/vue-logo.svg" />
            </picture>
            <span>Vue</span>
          </div>
        </SelectItem>
        <SelectItem value="nuxt">
          <div className="flex items-center gap-3">
            <picture>
              <img alt="nuxt logo" className="h-6 w-6" src="/nuxt-logo.svg" />
            </picture>
            <span>Nuxt</span>
          </div>
        </SelectItem>
        <SelectItem value="next">
          <div className="flex items-center gap-3">
            <picture>
              <img alt="next logo" className="h-6 w-6" src="/next-logo.svg" />
            </picture>
            <span>Next</span>
          </div>
        </SelectItem>
        <SelectItem value="svelte">
          <div className="flex items-center gap-3">
            <picture>
              <img
                alt="svelte logo"
                className="h-6 w-6"
                src="/svelte-logo.svg"
              />
            </picture>
            <span>Svelte</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
