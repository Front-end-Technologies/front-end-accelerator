"use client";

import "@xterm/xterm/css/xterm.css";
import { useThemeStore } from "@/app/store";
import FileExplorer from "@/components/file-explorer";
import { File } from "@/interfaces";
import { api } from "@/trpc/react";
import { javascript } from "@codemirror/lang-javascript";
import { materialLight } from "@uiw/codemirror-theme-material";
import { tokyoNightStorm } from "@uiw/codemirror-theme-tokyo-night-storm";
import CodeMirror from "@uiw/react-codemirror";
import { WebContainer } from "@webcontainer/api";
import { FitAddon } from "@xterm/addon-fit";
import { Terminal } from "@xterm/xterm";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

function WebIDE() {
  const theme = useThemeStore((state) => state.theme);

  const [editorValue, setEditorValue] = useState("");
  const [webcontainerFilePath, setWebContainerFilePath] = useState("");

  const hasBooted = useRef(false);
  const iFrameRef = useRef<HTMLIFrameElement>(null);
  const webcontainerRef = useRef<WebContainer>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

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

  const files = useMemo(() => {
    return data?.webcontainerFiles;
  }, [data?.webcontainerFiles]);

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

      webcontainerRef.current.on("server-ready", (_port, url) => {
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

    terminal.write("Running npm install...\r\n");

    const installProcess = await webcontainerRef.current?.spawn("npm", ["i"]);
    installProcess?.output.pipeTo(
      new WritableStream({
        write(data) {
          terminal.write(data);
        },
      }),
    );

    await installProcess?.exit;

    terminal.write("Starting dev server...\r\n");

    const devServerProcess = await webcontainerRef.current?.spawn("npm", [
      "run",
      "dev",
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
      <PanelGroup className="gap-1" direction="horizontal">
        <Panel defaultSize={15} minSize={5}>
          <FileExplorer
            setEditorValue={setEditorValue}
            setWebContainerFilePath={setWebContainerFilePath}
          />
        </Panel>
        <PanelResizeHandle />
        <Panel minSize={20}>
          <div className="h-full overflow-auto rounded-xl bg-code">
            <h3 className="sticky top-0 z-50 items-center border-b border-b-gray-200 bg-code p-4 text-center text-sm dark:border-b-gray-600">
              {webcontainerFilePath}
            </h3>
            <CodeMirror
              className="overflow-auto px-2 py-4 text-sm"
              extensions={[javascript({ jsx: true, typescript: true })]}
              onChange={onEditorChange}
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
      </PanelGroup>
      <div className="rounded-xl bg-code p-4">
        <div className="terminal h-40" ref={terminalRef}></div>
      </div>
    </div>
  );
}

export default WebIDE;
