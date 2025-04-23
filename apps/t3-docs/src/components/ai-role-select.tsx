import { useThemeStore } from "@/app/store";

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

export function AiRoleSelect() {
  const role = useThemeStore((state) => state.ai.role);
  const slang = useThemeStore((state) => state.ai.slang);
  const setAiRole = useThemeStore((state) => state.setAiRole);
  const setAiSlang = useThemeStore((state) => state.setAiSlang);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{role}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Select AI Role</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuCheckboxItem
            checked={role === "Software Architect"}
            onCheckedChange={(checked) =>
              checked && setAiRole("Software Architect")
            }
          >
            Software Architect
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={role === "Technical Expert"}
            onCheckedChange={(checked) =>
              checked && setAiRole("Technical Expert")
            }
          >
            Technical Expert
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={role === "Technical Software Engineer"}
            onCheckedChange={(checked) =>
              checked && setAiRole("Technical Software Engineer")
            }
          >
            Technical Software Engineer
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={role === "Technical Designer"}
            onCheckedChange={(checked) =>
              checked && setAiRole("Technical Designer")
            }
          >
            Technical Designer
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Select Language Style</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuCheckboxItem
            checked={slang === "Compact"}
            onCheckedChange={(checked) => checked && setAiSlang("Compact")}
          >
            Compact
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={slang === "Detailed"}
            onCheckedChange={(checked) => checked && setAiSlang("Detailed")}
          >
            Detailed
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={slang === "Gen-Z"}
            onCheckedChange={(checked) => checked && setAiSlang("Gen-Z")}
          >
            Gen-Z
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
