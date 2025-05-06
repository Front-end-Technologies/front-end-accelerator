import Link from "next/link";
import { memo } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const components: Partial<Components> = {
  pre: ({ children }) => <>{children}</>,
  ol: ({ children, ...props }) => {
    return (
      <ol className="list-decimal list-outside ml-4" {...props}>
        {children}
      </ol>
    );
  },
  li: ({ children, ...props }) => {
    return (
      <li className="py-1" {...props}>
        {children}
      </li>
    );
  },
  ul: ({ children, ...props }) => {
    return (
      <ul className="list-disc list-outside ml-4" {...props}>
        {children}
      </ul>
    );
  },
  strong: ({ children, ...props }) => {
    return (
      <span className="font-semibold" {...props}>
        {children}
      </span>
    );
  },
  a: ({ children, ...props }) => {
    return (
      <Link
        className="hover:underline"
        target="_blank"
        rel="noreferrer"
        href={props.href!}
      >
        {children}
      </Link>
    );
  },
  p: ({ children, ...props }) => {
    return <p {...props}>{children}</p>;
  },
  h1: ({ children, ...props }) => {
    return (
      <h1 className="text-3xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h1>
    );
  },
  h2: ({ children, ...props }) => {
    return (
      <h2 className="text-2xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h2>
    );
  },
  h3: ({ children, ...props }) => {
    return (
      <h3 className="text-xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h3>
    );
  },
  h4: ({ children, ...props }) => {
    return (
      <h4 className="text-lg font-semibold mt-6 mb-2" {...props}>
        {children}
      </h4>
    );
  },
  h5: ({ children, ...props }) => {
    return (
      <h5 className="text-base font-semibold mt-6 mb-2" {...props}>
        {children}
      </h5>
    );
  },
  h6: ({ children, ...props }) => {
    return (
      <h6 className="text-sm font-semibold mt-6 mb-2" {...props}>
        {children}
      </h6>
    );
  },
  table: ({ children, ...props }) => {
    return (
      <table className="min-w-full divide-y my-4" {...props}>
        {children}
      </table>
    );
  },
  thead: ({ children, ...props }) => {
    return <thead {...props}>{children}</thead>;
  },
  tbody: ({ children, ...props }) => {
    return <tbody className="divide-y" {...props}>{children}</tbody>;
  },
  tr: ({ children, ...props }) => {
    return <tr {...props}>{children}</tr>;
  },
  th: ({ children, ...props }) => {
    return (
      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" {...props}>
        {children}
      </th>
    );
  },
  td: ({ children, ...props }) => {
    return (
      <td className="px-6 py-4 whitespace-nowrap text-sm" {...props}>
        {children}
      </td>
    );
  },
  blockquote: ({ children, ...props }) => {
    return (
      <blockquote className="border-l-4 pl-4 italic" {...props}>
        {children}
      </blockquote>
    );
  },
  code: ({ children, ...props }) => {
    return (
      <code className="rounded px-1 py-0.5 font-mono text-sm" {...props}>
        {children}
      </code>
    );
  },
};

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children
);