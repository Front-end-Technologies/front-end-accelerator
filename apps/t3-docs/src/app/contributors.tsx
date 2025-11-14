"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/trpc/react";

export default function Contributors() {
  const [data] = api.gitHub.getMembers.useSuspenseQuery();

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-8">
      {data.map((member) => (
        <Card key={member.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage alt={member.avatar_url} src={member.avatar_url} />
                <AvatarFallback>UI</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-2">
                <a
                  className="text-sm font-bold"
                  href={`https://github.com/${member.login}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {`@${member.login || "/"}`}
                </a>

                <div className="text-xs font-normal italic">
                  {[member.user.name, member.user.location, member.user.company]
                    .filter(Boolean)
                    .join(", ")}
                </div>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent>
            {member.user.bio && <p className="text-xs">{member.user.bio}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
