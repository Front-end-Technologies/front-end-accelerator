"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/trpc/react";
import { BuildingIcon, MapIcon } from "lucide-react";

export default function Contributors() {
  const [data] = api.gitHub.getMembers.useSuspenseQuery();

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((member) => (
        <Card key={member.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage alt={member.avatar_url} src={member.avatar_url} />
                <AvatarFallback>UI</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-2">
                <span>{member.login || "/"}</span>
                {member.user.name && (
                  <a
                    className="text-xs font-normal italic"
                    href={`https://github.com/${member.login}`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    @{member.user.name}
                  </a>
                )}
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent>
            {member.user.bio && (
              <CardDescription className="text-xs italic">
                {member.user.bio}
              </CardDescription>
            )}
          </CardContent>

          <CardFooter className="flex flex-wrap justify-end gap-8 text-sm">
            {member.user.location && (
              <span className="flex items-center gap-2">
                <MapIcon />
                {member.user.location}
              </span>
            )}
            {member.user.company && (
              <span className="flex items-center gap-2">
                <BuildingIcon />
                {member.user.company}
              </span>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
