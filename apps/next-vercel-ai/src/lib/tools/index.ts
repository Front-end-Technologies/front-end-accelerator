import { createCalendarMeetingSuggestion, createDateRange, parseDate } from "./calendar-tools";
import { sendEmail } from "./email-tools";
import { getWeather } from "./weather-tools";

export const tools = {
    // Email tools
    sendEmail,

    // Weather tools
    getWeather,

    // Calendar tools
    createCalendarMeetingSuggestion,
    parseDate,
    createDateRange
  }