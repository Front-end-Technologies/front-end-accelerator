import { tool } from "ai"
import { z } from "zod"
import { createDateTime, parseRelativeDate } from "./date-utils"

export const createCalendarMeetingSuggestion = tool({
  description: "Create a calendar meeting suggestion with the specified details",
  parameters: z.object({
    title: z.string().describe("The title of the meeting"),
    startDate: z.coerce.date().describe("The start date and time of the meeting"),
    endDate: z.coerce.date().describe("The end date and time of the meeting"),
    attendees: z.array(z.string()).optional().describe("Email addresses, names, or alliasses like 'team', 'friends', etc of attendees"),
    description: z.string().optional().describe("Description of the meeting"),
    location: z.string().optional().describe("Location of the meeting"),
  }),
})

export type createCalendarMeetingSuggestionParams = z.infer<typeof createCalendarMeetingSuggestion["parameters"]>

// Add a new tool specifically for handling relative dates
export const parseDate = tool({
    description: "Parse a relative date reference into an actual date like 'today', 'tomorrow', 'next Monday', etc.",
    parameters: z.object({
      dateReference: z.string().describe("A relative date reference like 'today', 'tomorrow', 'next Monday', etc."),
      timeReference: z.string().optional().describe("An optional time reference like '9am', '3:30pm', etc."),
    }),
    execute: async ({ dateReference, timeReference }) => {
      console.log('⏰ Parsing date...')
      console.log(`Date Reference: ${dateReference}`)
      console.log(`TimeRreference: ${timeReference}`)
      try {
        // Use our utility function to parse the relative date
        const parsedDate = parseRelativeDate(dateReference)
  
        // Format the date in ISO format for the date part
        const isoDate = parsedDate.toISOString().split("T")[0]
  
        // If a time reference is provided, parse it as well
        if (timeReference) {
          const dateTime = createDateTime(dateReference, timeReference)
          return {
            date: isoDate,
            dateTime: dateTime.toISOString(),
            formattedDate: dateTime.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            formattedTime: dateTime.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }),
          }
        }
  
        // If no time reference, just return the date
        return {
          date: isoDate,
          formattedDate: parsedDate.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        }
      } catch (error) {
        return {
          error: `Could not parse "${dateReference}". Please use a specific date format like YYYY-MM-DD. Error: ${error}`,
        }
      }
    },
  })
  
export const createDateRange = tool({
    description: "Create a date range for a meeting or event",
    parameters: z.object({
      dateReference: z.string().describe("A date reference like 'today', 'tomorrow', 'next Monday', etc."),
      startTime: z.string().describe("The start time like '9am', '3:30pm', etc."),
      duration: z.number().optional().describe("Duration in minutes (default: 60)"),
      endTime: z.string().optional().describe("The end time (alternative to duration)"),
    }),
    execute: async ({ dateReference, startTime, duration = 60, endTime }) => {
      console.log('⏰ Creating date range...')
      console.log(`Date Reference: ${dateReference}`)
      console.log(`Start Time: ${startTime}`)
      console.log(`Duration: ${duration}`)
      console.log(`End Time: ${endTime}`)

      try {
        // Parse the start date and time
        const startDateTime = createDateTime(dateReference, startTime)
  
        // Calculate the end date and time
        let endDateTime: Date
  
        if (endTime) {
          // If end time is provided, use it
          endDateTime = createDateTime(dateReference, endTime)
        } else {
          // Otherwise use the duration
          endDateTime = new Date(startDateTime)
          endDateTime.setMinutes(endDateTime.getMinutes() + duration)
        }
  
        return {
          startDate: startDateTime.toISOString(),
          endDate: endDateTime.toISOString(),
          formattedStart: `${startDateTime.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })} at ${startDateTime.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}`,
          formattedEnd: endDateTime.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
        }
      } catch (error) {
        return {
          error: `Could not create date range. Please check your date and time formats. Error: ${error}`,
        }
      }
    },
  })

  export const tools = {
    createCalendarMeetingSuggestion,
    parseDate,
    createDateRange
  }
