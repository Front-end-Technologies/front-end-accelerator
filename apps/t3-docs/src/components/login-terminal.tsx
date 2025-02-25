"use client";
import "@xterm/xterm/css/xterm.css";
import { WebContainer } from "@webcontainer/api";
import { FitAddon } from "@xterm/addon-fit";
import { Terminal } from "@xterm/xterm";
import { useEffect, useRef } from "react";

const files = {
  "package.json": {
    file: {
      contents: `{
    "name": "demo-webcontainer",
    "type": "module"
}`,
    },
  },
};

export default function LoginTerminal() {
  const hasBooted = useRef(false);
  const webcontainerRef = useRef<WebContainer>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalInstanceRef = useRef<Terminal>(null);

  useEffect(() => {
    const bootWebContainer = async () => {
      const iFrameEl = document.querySelector("iframe");

      const fitAddon = new FitAddon();
      const terminal = new Terminal({ convertEol: true });
      terminalInstanceRef.current = terminal;

      terminal.loadAddon(fitAddon);
      terminal.open(terminalRef.current!);
      fitAddon.fit();

      webcontainerRef.current = await WebContainer.boot();

      await webcontainerRef.current.mount(files);
      await startShell(terminal);

      webcontainerRef.current.on("server-ready", (_port, url) => {
        iFrameEl?.setAttribute("src", url);
      });
    };

    if (!hasBooted.current && files) {
      bootWebContainer().catch((err) => console.error(err));
      hasBooted.current = true;
    }

    return () => {
      webcontainerRef.current?.teardown();
    };
  }, []);

  async function startShell(terminal: Terminal) {
    const shellProcess = await webcontainerRef.current?.spawn("jsh", {
      terminal: { cols: terminal.cols, rows: terminal.rows },
    });

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

  return (
    <>
      <div className="mx-auto w-[600px] gap-4 space-y-4 rounded-xl border border-dashed bg-code p-4 text-xs">
        <div className="terminal h-60" ref={terminalRef}></div>
      </div>
    </>
  );
}
