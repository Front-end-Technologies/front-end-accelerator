import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { formatDataStreamPart, type Message } from "@ai-sdk/ui-utils"
import { convertToCoreMessages, type DataStreamWriter, type ToolExecutionOptions, type ToolSet } from "ai"
import type { z } from "zod"

// Approval string to be shared across frontend and backend
export const APPROVAL = {
  YES: "Yes, confirmed.",
  NO: "No, denied.",
} as const

export const CALENDAR_APPROVAL = {
  Success: "Meeting has been created successfully",
  Denied: "Meeting denied by user. No meeting created",
}

function isValidToolName<K extends PropertyKey, T extends object>(key: K, obj: T): key is K & keyof T {
  return key in obj
}

/**
 * Processes tool invocations where human input is required, executing tools when authorized.
 */
export async function processToolCalls<
  Tools extends ToolSet,
  ExecutableTools extends {
    [Tool in keyof Tools as Tools[Tool] extends { execute: () => unknown } ? never : Tool]: Tools[Tool]
  },
>(
  {
    dataStream,
    messages,
  }: {
    tools: Tools // used for type inference
    dataStream: DataStreamWriter
    messages: Message[]
  },
  executeFunctions: {
    [K in keyof Tools & keyof ExecutableTools]?: (
      args: z.infer<ExecutableTools[K]["parameters"]>,
      context: ToolExecutionOptions,
    ) => Promise<unknown>
  },
): Promise<Message[]> {
  const lastMessage = messages[messages.length - 1]
  const parts = lastMessage.parts
  if (!parts) return messages

  const processedParts = await Promise.all(
    parts.map(async (part) => {
      // Only process tool invocations parts
      console.log('🔧 Processing part:', part)
      if (part.type !== "tool-invocation") return part

      console.log('🔧 Processing tool invocation:', part.toolInvocation.toolName)

      const { toolInvocation } = part
      const toolName = toolInvocation.toolName

      // Only continue if we have an execute function for the tool and it's in a 'result' state
      if (!(toolName in executeFunctions) || toolInvocation.state !== "result") return part

      let result
      if (toolInvocation.result === APPROVAL.YES) {
        // Get the tool and check if the tool has an execute function.
        if (!isValidToolName(toolName, executeFunctions) || toolInvocation.state !== "result") {
          return part
        }

        const toolInstance = executeFunctions[toolName]
        if (toolInstance) {
          result = await toolInstance(toolInvocation.args, {
            messages: convertToCoreMessages(messages),
            toolCallId: toolInvocation.toolCallId,
          })
        } else {
          result = "Error: No execute function found on tool"
        }
      } else if (toolInvocation.result === APPROVAL.NO) {
        result = "Meeting denied by user. You may not create a meeting"
      } else {
        // For any unhandled responses, return the original part.
        return part
      }

      // Forward updated tool result to the client.
      dataStream.write(
        formatDataStreamPart("tool_result", {
          toolCallId: toolInvocation.toolCallId,
          result
        }),
      )

      // Return updated toolInvocation with the actual result.
      return {
        ...part,
        toolInvocation: {
          ...toolInvocation,
          result,
        },
      }
    }),
  )

  // Finally return the processed messages
  return [...messages.slice(0, -1), { ...lastMessage, parts: processedParts }]
}

export function getToolsRequiringConfirmation<T extends ToolSet>(tools: T): string[] {
  return (Object.keys(tools) as (keyof T)[]).filter((key) => {
    const maybeTool = tools[key]
    return typeof maybeTool.execute !== "function"
  }) as string[]
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
