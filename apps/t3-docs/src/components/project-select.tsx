"use client";

import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function ProjectSelect() {
  const { framework, name } = useParams() as {
    framework: string;
    name: string;
    type: string;
  };
  console.log("name: ", name);
  const router = useRouter();

  const { data: folders } = api.gitHub.getFolders.useQuery();

  const { data: projects } = api.gitHub.getProjects.useQuery(
    { framework },
    { enabled: !!framework && !!folders },
  );

  return (
    <>
      <Select
        onValueChange={(value) => {
          const currentProject = projects?.find((project) =>
            project.data?.some((p) => p.name === value),
          );

          router.push(`/${framework}/${currentProject?.type}/${value}`);
        }}
        value={name|| ""}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a project" />
        </SelectTrigger>
        <SelectContent>
          {projects?.map((project) => (
            <SelectGroup key={project.type}>
              <SelectLabel>{project.type}</SelectLabel>
              {project.data?.map((project) => (
                <SelectItem key={project.name} value={project.name}>
                  <div className="flex items-center gap-3">{project.name}</div>
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
