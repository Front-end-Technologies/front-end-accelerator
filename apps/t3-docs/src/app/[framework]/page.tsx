"use client";

import { AiCoach } from "@/components/ai-coach";
import { MarkdownContent } from "@/components/markdown-content";
import { Button } from "@/components/ui/button";
import { useToggle } from "@/hooks/use-toggle";
import { Framework } from "@/lib/const";
import { cn, handleAIStream } from "@/lib/utils";
import { api } from "@/trpc/react";
import { AppBskyEmbedExternal } from "@atproto/api";
import { CircleX, Link, Sparkle } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import { useThemeStore } from "../store";

export default function Detail() {
  const ai = useThemeStore((state) => state.ai);

  const [aiOutput, setAiOutput] = useState("");
  const { framework } = useParams<{ framework: Framework }>();
  const detailToggle = useToggle();

  const { data } = api.bluesky.getFeed.useQuery({ framework });

  return (
    <PanelGroup className="gap-2" direction="horizontal">
      <Panel defaultSize={30} maxSize={50} minSize={30}>
        <div
          className={cn("scrollbar-hide overflow-auto", {
            "flex flex-col gap-4": detailToggle.open,
            "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4":
              !detailToggle.open,
          })}
          style={{ height: "calc(100vh - 5rem)" }}
        >
          {data?.map(({ post }) => {
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
                        {new Date(
                          `${post.record.createdAt}`,
                        ).toLocaleDateString("be-NL")}
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
                        setAiOutput("");

                        detailToggle.setToggle(true);

                        try {
                          const controller = new AbortController();
                          const response = await fetch("/api/ai/summary", {
                            body: JSON.stringify({
                              framework: {
                                input: framework,
                              },
                              llm: ai.llm,
                              payload: post.record.text,
                              role: ai.role,
                              slang: ai.slang,
                              uri: AppBskyEmbedExternal.isView(post.embed)
                                ? post.embed.external.uri
                                : undefined,
                            }),
                            method: "POST",
                            signal: controller.signal,
                          });

                          handleAIStream(response, {
                            onData: (data) => {
                              setAiOutput((prev) => prev + data);
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
                      AI Summary
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      <PanelResizeHandle />

      {detailToggle.open && (
        <Panel minSize={20}>
          <div
            className="bg-code scrollbar-hide flex h-full flex-col gap-8 overflow-auto rounded-xl border p-4"
            style={{ height: "calc(100vh - 5rem)" }}
          >
            <div className="flex items-start justify-between gap-4">
              <AiCoach />
              <Button
                onClick={() => {
                  detailToggle.toggle();
                }}
                size="icon"
                variant="ghost"
              >
                <CircleX />
              </Button>
            </div>

            <MarkdownContent>{aiOutput}</MarkdownContent>
          </div>
        </Panel>
      )}
    </PanelGroup>
  );
}
