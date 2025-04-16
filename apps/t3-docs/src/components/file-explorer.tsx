import { Button } from "@/components/ui/button";
import { GitHubContent } from "@/interfaces";
import { api } from "@/trpc/react";
import { Folder, FolderOpen } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

interface Props {
  setEditorValue: (value: string) => void;
  setWebContainerFilePath: (value: string) => void;
}

export default function FileExplorer({
  setEditorValue,
  setWebContainerFilePath,
}: Props) {
  const [expandedDirs, setExpandedDirs] = useState<Record<string, boolean>>({});
  const [activePage, setActivePage] = useState<null | string>(null);
  const { framework, name, type } = useParams<{
    framework: string;
    name: string;
    type: string;
  }>();

  const { data } = api.gitHub.getProject.useQuery({
    framework,
    name,
    type,
  });

  const sortedRepoContent = useMemo(() => {
    if (!data?.repoContent) return [];
    return [...data.repoContent].sort((a, b) => {
      if (a.type === "dir" && b.type !== "dir") return -1;
      if (a.type !== "dir" && b.type === "dir") return 1;
      return a.name.localeCompare(b.name);
    });
  }, [data]);

  const renderTree = (item: GitHubContent) => {
    return (
      <li key={item.name}>
        {item.type === "dir" ? (
          <>
            <Button
              onClick={() => {
                setExpandedDirs((prev) => ({
                  ...prev,
                  [item.name]: !prev[item.name],
                }));
              }}
              variant="ghost"
            >
              {expandedDirs[item.name] ? (
                <FolderOpen
                  className="ml-1 h-12"
                  fill="#FFD700"
                  stroke="#FF8C00"
                />
              ) : (
                <Folder className="ml-1 h-12" fill="#FFD700" stroke="#FF8C00" />
              )}

              {item.name}
            </Button>
            {expandedDirs[item.name] && (
              <ul className="pl-3">
                {(item.contents as GitHubContent[])?.map((child) =>
                  renderTree(child),
                )}
              </ul>
            )}
          </>
        ) : (
          <Button
            className="w-full justify-start rounded-none"
            onClick={() => {
              setEditorValue(item.contents as string);
              setWebContainerFilePath(
                item.path.replace(new RegExp(`.*${name}`, "g"), ""),
              );
              setActivePage(item.name);
            }}
            variant={activePage === item.name ? "outline" : "ghost"}
          >
            {(item.name.endsWith(".ts") || item.name.endsWith(".tsx")) &&
              !item.name.includes("config") &&
              !item.name.endsWith("spec.ts") &&
              !item.name.endsWith("test.ts") && (
                <picture className="shrink-0">
                  <img alt="typescript-logo" src="/ts-logo.svg" width={16} />
                </picture>
              )}
            {item.name.endsWith(".json") && (
              <picture className="shrink-0">
                <img alt="json-logo" src="/json-logo.svg" width={16} />
              </picture>
            )}
            {item.name.endsWith(".html") && (
              <picture className="shrink-0">
                <img alt="html-logo" src="/html-logo.svg" width={16} />
              </picture>
            )}
            {item.name.startsWith("eslint") && (
              <picture className="shrink-0">
                <img alt="eslint-logo" src="/eslint-logo.svg" width={16} />
              </picture>
            )}

            {item.name.startsWith(".git") && (
              <picture className="shrink-0">
                <img alt="git-logo" src="/git-logo.svg" width={16} />
              </picture>
            )}
            {item.name.endsWith(".md") && (
              <picture className="shrink-0">
                <img alt="md-logo" src="/md-logo.svg" width={16} />
              </picture>
            )}
            {item.name.startsWith("vite") && (
              <picture className="shrink-0">
                <img alt="vite-logo" src="/vite-logo.svg" width={16} />
              </picture>
            )}
            {item.name.endsWith(".css") && (
              <picture className="shrink-0">
                <img alt="css-logo" src="/css-logo.svg" width={16} />
              </picture>
            )}
            {item.name.startsWith("postcss") && (
              <picture className="shrink-0">
                <img alt="css-logo" src="/css-logo.svg" width={16} />
              </picture>
            )}
            {item.name.startsWith("tailwind") && (
              <picture className="shrink-0">
                <img alt="tailwind-logo" src="/tailwind-logo.svg" width={16} />
              </picture>
            )}

            {item.name.endsWith("spec.ts") && (
              <picture className="shrink-0">
                <img
                  alt="playwright-logo"
                  src="/playwright-logo.svg"
                  width={16}
                />
              </picture>
            )}
            {item.name.endsWith(".js") && !item.name.includes("config") && (
              <picture className="shrink-0">
                <img alt="js-logo" src="/js-logo.svg" width={16} />
              </picture>
            )}
            {item.name.endsWith("test.ts") && (
              <picture className="shrink-0">
                <img alt="vitest-logo" src="/vitest-logo.svg" width={16} />
              </picture>
            )}

            {item.name.endsWith(".vue") && (
              <picture className="shrink-0">
                <img alt="vue-logo" src="/vue-logo.svg" width={16} />
              </picture>
            )}

            {item.name.startsWith("nuxt") && (
              <picture className="shrink-0">
                <img alt="nuxt-logo" src="/nuxt-logo.svg" width={16} />
              </picture>
            )}

            {item.name.startsWith("next") && (
              <picture className="shrink-0">
                <img alt="next-logo" src="/next-logo.svg" width={16} />
              </picture>
            )}

            {item.name}
          </Button>
        )}
      </li>
    );
  };

  return (
    <ul className="bg-code col-span-2 h-full overflow-auto rounded-xl py-2">
      {sortedRepoContent?.map((item) => renderTree(item))}
    </ul>
  );
}
