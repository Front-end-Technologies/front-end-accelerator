import { useTheme } from "next-themes";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  nightOwl,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

interface Props {
  children: string;
}

export function MarkdownContent({ children }: Props) {
  const { theme } = useTheme();

  return (
    <Markdown
      components={{
        code({ children, className }) {
          const match = /language-(\w+)/.exec(className || "");
          return match ? (
            <SyntaxHighlighter
              language={match[1]}
              PreTag="div"
              style={theme === "dark" ? nightOwl : oneLight}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code className="text-chart-3 p-0.5 px-1 font-bold italic">
              {children}
            </code>
          );
        },
      }}
    >
      {children}
    </Markdown>
  );
}
