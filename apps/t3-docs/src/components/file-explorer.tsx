import { Button } from "@/components/ui/button";
import { GitHubContent } from "@/interfaces";
import { api } from "@/trpc/react";
import { FileJson, Folder } from "lucide-react";
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
              <Folder className="h-6 text-orange-400" />
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
            onClick={() => {
              setEditorValue(item.contents as string);
              setWebContainerFilePath(
                item.path.replace(new RegExp(`.*${name}`, "g"), ""),
              );
            }}
            variant="ghost"
          >
            <FileJson className="h-6 text-blue-500" />
            {item.name}
          </Button>
        )}
      </li>
    );
  };

  return (
    <ul className="bg-code col-span-2 h-full rounded-xl py-2 pr-8">
      {sortedRepoContent?.map((item) => renderTree(item))}
    </ul>
  );
}
