import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";
import Link from "next/link";
import { JSX, useState } from "react";

function Pre({ children }: { children: JSX.Element }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const codeContent = children?.props?.children || "";
    navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  return (
    <div className="relative group">
      <pre className="bg-gray-900 text-purple-300 p-4 rounded-lg border border-gray-700 overflow-x-auto my-4 max-w-md">
        {children}
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 bg-purple-500 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:cursor-pointer"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}


export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Custom heading styles
    h1: ({ children, ...props }) => (
      <h1 className="text-3xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 className="text-2xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className="text-xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h3>
    ),
    h4: ({ children, ...props }) => (
      <h4 className="text-lg font-semibold mt-6 mb-2" {...props}>
        {children}
      </h4>
    ),
    h5: ({ children, ...props }) => (
      <h5 className="text-base font-semibold mt-6 mb-2" {...props}>
        {children}
      </h5>
    ),
    h6: ({ children, ...props }) => (
      <h6 className="text-sm font-semibold mt-6 mb-2" {...props}>
        {children}
      </h6>
    ),

    // Custom code block styling with copy button
    pre: Pre,
    code: ({ children, ...props }) => (
      <code
        className="rounded px-1 py-0.5 font-mono text-sm bg-gray-800 "
        {...props}
      >
        {children}
      </code>
    ),

    // Custom image handling
    img: (props) => (
      // eslint-disable-next-line jsx-a11y/alt-text
      <Image
        sizes="100vw"
        style={{ width: "100%", height: "auto" }}
        {...(props as ImageProps)}
      />
    ),

    // Custom list styling
    ol: ({ children, ...props }) => {
      return (
        <ol className="list-decimal marker:text-purple-300 list-outside ml-4" {...props}>
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

    // Custom link styling
    a: ({ children, ...props }) => {
      return (
        <Link
          className="bg-purple-300 rounded-xl px-2 hover:bg-purple-500 text-black hover:text-white transition-colors duration-200"
          target="_blank"
          rel="noreferrer"
          href={props.href!}
        >
          {children}
        </Link>
      );
    },

    // Spread additional components
    ...components,
  };
}
