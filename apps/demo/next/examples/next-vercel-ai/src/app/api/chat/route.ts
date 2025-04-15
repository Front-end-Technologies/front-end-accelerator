import { google } from "@ai-sdk/google"
import { createDataStreamResponse, experimental_createMCPClient, streamText, ToolExecutionOptions } from "ai"

import { CreateCalendarMeetingParams, tools } from "@/lib/tools"
import { processToolCalls } from "@/lib/utils"

// Mock function to add a meeting to calendar
async function addToCalendar(meetingDetails: CreateCalendarMeetingParams) {
  console.log("Adding meeting to calendar:", meetingDetails)
  // In a real app, you would integrate with a calendar API here
  return {
    success: true,
    meetingId: `meeting-${Date.now()}`,
    details: meetingDetails,
  }
}

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Create a system message with current date information
  const systemMessage = `Be a positive calendar assistant. You can schedule meetings.

    Format text for Notion.
    Format image links (ex: https://raw.githubusercontent.com/jamesmontemagno/app-monkeys/master/baboon.jpg") as ![image](https://raw.githubusercontent.com/jamesmontemagno/app-monkeys/master/baboon.jpg).
    Use emojis to make the conversation more engaging.
    
    When a user refers to relative dates like "today", "tomorrow", or "next Monday", use the parseDate tool to convert them to actual dates.

    For meeting requests, use the createDateRange tool to generate proper start and end times, then use createCalendarMeeting to create the meeting.
    Example: If a user says "Schedule a team meeting tomorrow at 2pm", you should:
    1. Use parseDate to convert "tomorrow" to an actual date
    2. Use createDateRange to create a time range from 2pm to 3pm
    3. Use createCalendarMeeting with the resulting dates to create the meeting
    `

    try {
        const clientOne = await experimental_createMCPClient({
            transport: {
                type: 'sse',
                url: 'http://localhost:63499/sse',
            }
        });

        const toolSetSSE = await clientOne.tools();

        return createDataStreamResponse({
            execute: async (dataStream) => {
              // Process any tool results from previous messages
              const processedMessages = await processToolCalls(
                { tools, dataStream, messages },
                {
                  createCalendarMeeting: async (args) => {
                    // This is where we would actually add the meeting to the calendar
                    // after user confirmation
                    await addToCalendar(args)
                    return '__CALENDAR_MEETING_ADDED__'
                  },
                },
              )

              // Apply custom formatting to MCP tool responses
              const mcpToolsFormat = Object.fromEntries(
                Object.entries(toolSetSSE).map(([key, tool]) => [
                  key,
                  {
                    description: tool.description, // Copy the tool's description
                    parameters: tool.parameters,   // Copy the tool's parameters
                    execute: async (args: unknown) => {
                      console.log('Executing tool:', key);
                      const options: ToolExecutionOptions = {
                        toolCallId: `tool-call-${Date.now()}`, // Generate a unique tool call ID
                        messages, // Use the messages from the request
                        abortSignal: undefined, // Optional: Add an AbortSignal if needed
                      };
                      const response = await tool.execute(args, options); // Call the tool's execute method
                      console.log('Tool response:', response);
                      console.log('custom response: ', {
                        actionType: key, // Use the tool key as the action type
                        response,        // Include the raw response
                        metadata: {
                          description: tool.description,
                          parameters: tool.parameters,
                        },
                      })

                      // Return structured data for custom UI rendering
                      return {
                        actionType: key, // Use the tool key as the action type
                        response,        // Include the raw response
                        metadata: {
                          description: tool.description,
                          parameters: tool.parameters,
                        },
                      };
                    },
                  },
                ])
              );
    
              // Stream the text with the updated messages
              const result = streamText({
                model: google("gemini-2.0-flash-001"),
                system: systemMessage,
                messages: processedMessages,
                maxSteps: 10,
                tools: {...tools, ...mcpToolsFormat},
              })
        
              result.mergeIntoDataStream(dataStream)
            },
          })

    } catch (error) {
        console.error(error);
    }
}
