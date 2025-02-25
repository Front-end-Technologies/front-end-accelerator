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

  const repoContent = useMemo(() => {
    return data?.repoContent;
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
              <ul className="pl-2">
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
    <ul className="col-span-2 h-full rounded-xl bg-code py-2 pr-8">
      {repoContent?.map((item) => renderTree(item))}
    </ul>
  );
}
