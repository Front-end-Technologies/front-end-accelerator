import { createCalendarMeetingSuggestionParams, tools } from "@/lib/tools";
import { processToolCalls,APPROVAL } from "@/lib/utils";
import { google } from "@ai-sdk/google";
import { createDataStreamResponse, streamText } from "ai";

// Mock function to add a meeting to calendar
async function addToCalendar(meetingDetails: createCalendarMeetingSuggestionParams) {
  console.log("Adding meeting to calendar:", meetingDetails)
  // In a real app, you would integrate with a calendar API here
  return {
    success: true,
    meetingId: `meeting-${Date.now()}`,
    details: meetingDetails,
  }
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Create a system message with current date information
  const systemMessage = `Be a positive calendar assistant. You can schedule meetings.
    Format text for Notion.
    Use emojis to make the conversation more engaging.
    
    When a user refers to relative dates like "today", "tomorrow", or "next Monday", use the parseDate tool to convert them to actual dates.

    For meeting requests, use the createDateRange tool to generate proper start and end times, then use createCalendarMeetingSuggestion to create the meeting.
    Example: If a user says "Schedule a team meeting tomorrow at 2pm", you should:
    1. Use 'parseDate' to convert "tomorrow" to an actual date
    2. Use 'createDateRange' to create a time range from 2pm to 3pm
    3. Use 'createCalendarMeetingSuggestion' with the resulting dates to create the meeting

    If the 'createCalendarMeetingSuggestion' tool returns ${APPROVAL.NO}. Tell the user you will not schedule the meeting.
    `

    console.log('doing this call')

    return createDataStreamResponse({
        execute: async (dataStream) => {
          // Process any tool results from previous messages
          const processedMessages = await processToolCalls(
            { tools, dataStream, messages },
            {
              createCalendarMeetingSuggestion: async (args) => {
                // This is where we would actually add the meeting to the calendar
                // after user confirmation
                await addToCalendar(args)
                return APPROVAL.YES;
              },
            },
          )

          // Stream the text with the updated messages
          const result = streamText({
            model: google("gemini-2.0-flash-001"),
            system: systemMessage,
            messages: processedMessages,
            maxSteps: 10,
            tools: tools,
            onError: (error) => {
              console.error("Error:", error)
            }
          })
    
          result.mergeIntoDataStream(dataStream)
        },
      })
}
