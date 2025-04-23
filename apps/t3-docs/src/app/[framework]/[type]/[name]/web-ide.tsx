"use client";

import "@xterm/xterm/css/xterm.css";
import { useThemeStore } from "@/app/store";
import { AIChat } from "@/components/ai-chat";
import { AiResponseDialog } from "@/components/ai-response-dialog";
import { AiRoleSelect } from "@/components/ai-role-select";
import FileExplorer from "@/components/file-explorer";
import { FrameworkSelect } from "@/components/framework-select";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { File } from "@/interfaces";
import { handleAIStream } from "@/lib/utils";
import { api } from "@/trpc/react";
import { javascript } from "@codemirror/lang-javascript";
import { materialLight } from "@uiw/codemirror-theme-material";
import { tokyoNightStorm } from "@uiw/codemirror-theme-tokyo-night-storm";
import CodeMirror, {
  EditorView,
  ReactCodeMirrorRef,
} from "@uiw/react-codemirror";
import { WebContainer } from "@webcontainer/api";
import { FitAddon } from "@xterm/addon-fit";
import { Terminal } from "@xterm/xterm";
import { GitCompare, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

interface Params {
  [key: string]: string;
  framework: string;
  name: string;
  type: string;
}

function WebIDE() {
  const { framework, name, type } = useParams<Params>();
  const { theme } = useTheme();

  const ai = useThemeStore((state) => state.ai);
  const role = useThemeStore((state) => state.ai.role);

  const [webcontainerFilePath, setWebContainerFilePath] = useState("");
  const [selectedCode, setSelectedCode] = useState("");
  const [editorValue, setEditorValue] = useState("");
  const [aiOutput, setAiOutput] = useState("");

  const codeMirrorRef = useRef<ReactCodeMirrorRef>(null);
  const iFrameRef = useRef<HTMLIFrameElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const webcontainerRef = useRef<WebContainer>(null);
  const hasBooted = useRef(false);

  const { data } = api.gitHub.getProject.useQuery({
    framework,
    name,
    type,
  });

  const files = useMemo(() => {
    return data?.webcontainerFiles;
  }, [data?.webcontainerFiles]);

  // codemirror
  useEffect(() => {
    if (codeMirrorRef.current?.view) {
      const { view } = codeMirrorRef.current;

      const getSelection = () => {
        if (view) {
          const selection = view.state.selection.main;
          return view.state.doc.sliceString(selection.from, selection.to);
        }
      };

      view.dom.addEventListener("mousedown", () => {
        console.log("currently selecting code");
      });

      view.dom.addEventListener("mouseup", () => {
        setSelectedCode(getSelection() || "");
      });
    }
  }, [codeMirrorRef.current?.state, codeMirrorRef.current?.view]);

  useEffect(() => {
    const bootWebContainer = async () => {
      const fitAddon = new FitAddon();
      const terminal = new Terminal({ convertEol: true });
      terminal.loadAddon(fitAddon);
      terminal.open(terminalRef.current!);
      fitAddon.fit();

      webcontainerRef.current = await WebContainer.boot();

      if (files) {
        await webcontainerRef.current.mount(files);
      }

      await startShell(terminal);

      webcontainerRef.current.on("server-ready", (port, url) => {
        iFrameRef.current?.setAttribute("src", url);
      });
    };

    if (!hasBooted.current && files) {
      bootWebContainer().catch((err) => console.error(err));
      hasBooted.current = true;
    }

    return () => {
      webcontainerRef.current?.teardown();
    };
  }, [name, framework, type, files]);

  useEffect(() => {
    if (editorValue === "" && files) {
      const readMeFile = files?.["README.md"] as File;
      setEditorValue(readMeFile.file.contents);
      setWebContainerFilePath("README.md");
    }
  }, [editorValue, files]);

  async function startShell(terminal: Terminal) {
    const shellProcess = await webcontainerRef.current?.spawn("jsh", {
      terminal: { cols: terminal.cols, rows: terminal.rows },
    });

    terminal.write("Running pnpm install...\r\n");

    const installProcess = await webcontainerRef.current?.spawn("pnpm", ["i"]);
    installProcess?.output.pipeTo(
      new WritableStream({
        write(data) {
          terminal.write(data);
        },
      }),
    );

    await installProcess?.exit;

    terminal.write("Starting dev server...\r\n");

    const devServerProcess = await webcontainerRef.current?.spawn("pnpm", [
      "run",
      "webcontainer",
    ]);
    devServerProcess?.output.pipeTo(
      new WritableStream({
        write(data) {
          terminal.write(data);
        },
      }),
    );

    shellProcess?.output.pipeTo(
      new WritableStream({
        write(data) {
          terminal.write(data);
        },
      }),
    );

    const input = shellProcess?.input.getWriter();
    terminal.onData((data) => {
      input?.write(data);
    });

    return shellProcess;
  }

  const onEditorChange = useCallback(
    async (val: string) => {
      setEditorValue(val);
      await webcontainerRef.current?.fs.writeFile(webcontainerFilePath, val);
    },
    [webcontainerFilePath],
  );

  return (
    <div className="flex h-[calc(100vh-76px)] flex-col space-y-2">
      <PanelGroup className="gap-1" direction="vertical">
        <Panel>
          <PanelGroup className="gap-1" direction="horizontal">
            <Panel defaultSize={15} minSize={5}>
              <FileExplorer
                setEditorValue={setEditorValue}
                setWebContainerFilePath={setWebContainerFilePath}
              />
            </Panel>
            <PanelResizeHandle />
            <Panel minSize={20}>
              <div className="bg-code scrollbar-hide h-full overflow-auto rounded-xl">
                <div className="bg-code scrollbar-hide sticky top-0 z-50 flex items-center justify-between gap-4 overflow-auto border-b border-b-gray-200 p-4 text-center text-sm dark:border-b-gray-600">
                  <strong className="">{webcontainerFilePath}</strong>
                  <div className="flex items-center gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className="cursor-pointer"
                          onClick={async () => {
                            try {
                              const controller = new AbortController();
                              const response = await fetch("/api/ai/explain", {
                                body: JSON.stringify({
                                  code: selectedCode,
                                  framework: {
                                    input: framework,
                                    output: ai.framework.output,
                                  },
                                  llm: ai.llm,
                                  role: ai.role,
                                  slang: ai.slang,
                                }),
                                method: "POST",
                                signal: controller.signal,
                              });

                              handleAIStream(response, (data) => {
                                setAiOutput((prevCode) => prevCode + data);
                              });
                              // copyToClipboard(data);
                            } catch (error) {
                              // toast
                              console.error("error: ", error);
                            }
                          }}
                          size="icon"
                          variant="ghost"
                        >
                          <Sparkles />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Explain selected code as {role}
                      </TooltipContent>
                    </Tooltip>

                    <AiRoleSelect />

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={async () => {
                            const controller = new AbortController();

                            const response = await fetch("/api/ai/compare", {
                              body: JSON.stringify({
                                code: selectedCode,
                                framework: {
                                  input: framework,
                                  output: ai.framework.output,
                                },
                                llm: ai.llm,
                                role: ai.role,
                                slang: ai.slang,
                              }),
                              method: "POST",
                              signal: controller.signal,
                            });

                            handleAIStream(response, (data) => {
                              setAiOutput((prevCode) => prevCode + data);
                            });
                          }}
                          size="icon"
                          variant="ghost"
                        >
                          <GitCompare />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Compare selected code to {ai.framework.output}
                      </TooltipContent>
                    </Tooltip>

                    <FrameworkSelect />
                  </div>
                </div>
                <CodeMirror
                  className="scrollbar-hide overflow-auto px-2 py-4 text-sm text-wrap"
                  extensions={[
                    javascript({ jsx: true, typescript: true }),
                    EditorView.lineWrapping,
                  ]}
                  onChange={onEditorChange}
                  ref={codeMirrorRef}
                  theme={theme === "dark" ? tokyoNightStorm : materialLight}
                  value={editorValue}
                />
              </div>
            </Panel>

            <PanelResizeHandle />

            <Panel minSize={20}>
              <iframe
                className="rounded-xl border bg-white"
                height={"100%"}
                ref={iFrameRef}
                src="/iFramePlaceholder.html"
                title="Loading Preview"
                width={"100%"}
              ></iframe>
            </Panel>

            {ai.chat.open && (
              <>
                <PanelResizeHandle />
                <Panel defaultSize={25} minSize={20}>
                  <AIChat />
                </Panel>
              </>
            )}
          </PanelGroup>
        </Panel>
        <PanelResizeHandle />
        <Panel defaultSize={15} maxSize={40} minSize={15}>
          <div className="bg-code h-full rounded-xl p-4">
            <div className="terminal h-full" ref={terminalRef}></div>
          </div>
        </Panel>
      </PanelGroup>

      <AiResponseDialog
        aiOutput={aiOutput}
        onOpenChange={() => setAiOutput("")}
      />
    </div>
  );
}

export default WebIDE;
