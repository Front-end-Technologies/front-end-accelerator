"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

import { Framework } from "@/lib/const";
import { api } from "@/trpc/react";

import { FrameworkLogo } from "./app-sidebar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function FoldersSelect() {
  const { framework } = useParams() as { framework: Framework };
  const router = useRouter();

  const { data: folders } = api.gitHub.getFolders.useQuery();

  return (
    <>
      <Select
        onValueChange={(value) => {
          router.push(`/${value}`);
        }}
        value={framework || ""}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a framework" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {folders?.map((folder) => (
              <SelectItem key={folder.name} value={folder.name}>
                <div className="flex items-center gap-3">
                  <FrameworkLogo framework={folder.name as Framework} />
                  {folder.name}
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
}
