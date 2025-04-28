"use client";

import { MarkdownContent } from "@/components/markdown-content";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Frameworks } from "@/lib/const";
import { handleAIStream } from "@/lib/utils";
import { api } from "@/trpc/react";
import { AppBskyEmbedExternal } from "@atproto/api";
import { Link, Sparkle } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

import { useThemeStore } from "../store";

export default function Detail() {
  const [aiOutput, setAiOutput] = useState("");
  const ai = useThemeStore((state) => state.ai);
  const { framework } = useParams();

  const { data: posts } = api.bluesky.getFeed.useQuery({
    framework: framework as Frameworks,
  });

  return (
    <div
      className="flex gap-8 overflow-auto p-4 font-sans"
      style={{ height: "calc(100vh - 5rem)" }}
    >
      <div
        className="grid gap-8 overflow-auto sm:grid-cols-1 md:grid-cols-2 2xl:grid-cols-3"
        style={{ height: "calc(100vh - 7rem)" }}
      >
        {posts?.map(({ post }) => {
          return (
            <div
              className="bg-code flex flex-col justify-between gap-8 rounded-xl border p-4"
              key={post.cid}
            >
              <div className="flex flex-col gap-8">
                <div className="flex flex-row items-start">
                  <div>
                    {AppBskyEmbedExternal.isView(post.embed) && (
                      <h5>
                        <a
                          className="font-bold hover:underline"
                          href={post.embed.external.uri}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {post.embed.external.title}
                        </a>
                      </h5>
                    )}
                    <p>
                      @{post.author.handle} -{" "}
                      {new Date(`${post.record.createdAt}`).toLocaleDateString(
                        "be-NL",
                      )}
                    </p>
                  </div>
                </div>
                <div>
                  <p>{`${post.record.text}`}</p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <picture>
                  <a
                    href={`https://bsky.app/profile/${post.author.handle}`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <picture>
                      <img
                        alt={post.author.handle}
                        className="h-8 w-8 rounded-full"
                        src={`${framework}-logo.svg`}
                      />
                    </picture>
                  </a>
                </picture>

                <div className="flex justify-between gap-4">
                  {AppBskyEmbedExternal.isView(post.embed) && (
                    <a
                      className="flex items-center"
                      href={post.embed.external.uri}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <Button variant="outline">
                        <Link />
                        Read more
                      </Button>
                    </a>
                  )}

                  <Button
                    onClick={async () => {
                      try {
                        const controller = new AbortController();
                        const response = await fetch("/api/ai/resume", {
                          body: JSON.stringify({
                            framework: {
                              input: framework,
                            },
                            llm: ai.llm,
                            payload: post.record.text,
                            role: ai.role,
                            slang: ai.slang,
                          }),
                          method: "POST",
                          signal: controller.signal,
                        });

                        handleAIStream(response, {
                          onData: (data) => {
                            console.log("data: ", data);
                            setAiOutput((prevCode) => prevCode + data);
                          },
                        });
                        // copyToClipboard(data);
                      } catch (error) {
                        // toast
                        console.error("error: ", error);
                      }
                    }}
                    variant="outline"
                  >
                    <Sparkle />
                    AI resume
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {aiOutput && (
        <div
          className="bg-code scrollbar-hide flex flex-col gap-8 overflow-auto rounded-xl border p-4"
          style={{ height: "calc(100vh - 7rem)" }}
        >
          <div>
            <Avatar className="h-16 w-16">
              <AvatarImage alt="ai-coach" src="/ai-coach.webp" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <span>AI-Coach: {ai.role}</span>
            <span>
              {" "}
              Explaining code with {ai.llm.provider} {ai.llm.name} in {ai.slang}{" "}
              style
            </span>
          </div>

          <MarkdownContent>{aiOutput}</MarkdownContent>
        </div>
      )}
    </div>
  );
}
