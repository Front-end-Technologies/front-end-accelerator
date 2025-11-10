/**
 * Parses relative date references and returns a Date object
 * @param dateReference - A string like "today", "tomorrow", "next Monday", etc.
 * @returns A Date object for the referenced date
 */
export function parseRelativeDate(dateReference: string): Date {
    const now = new Date()
    const lowerRef = dateReference.toLowerCase().trim()
  
    // Handle common relative date references
    if (lowerRef === "today") {
      return now
    }
  
    if (lowerRef === "tomorrow") {
      const tomorrow = new Date(now)
      tomorrow.setDate(now.getDate() + 1)
      return tomorrow
    }
  
    if (lowerRef === "yesterday") {
      const yesterday = new Date(now)
      yesterday.setDate(now.getDate() - 1)
      return yesterday
    }
  
    // Handle "next X" references
    if (lowerRef.startsWith("next ")) {
      const dayName = lowerRef.substring(5)
      const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
      const targetDayIndex = daysOfWeek.indexOf(dayName)
  
      if (targetDayIndex !== -1) {
        const result = new Date(now)
        const currentDayIndex = now.getDay()
        let daysToAdd = targetDayIndex - currentDayIndex
  
        // If the day has already occurred this week, go to next week
        if (daysToAdd <= 0) {
          daysToAdd += 7
        }
  
        result.setDate(now.getDate() + daysToAdd)
        return result
      }
    }
  
    // If we can't parse it as a relative reference, try to parse it as a date string
    const parsedDate = new Date(dateReference)
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate
    }
  
    // Default to today if we can't parse it
    return now
  }
  
  /**
   * Formats a date as a time string (e.g., "9:00 AM")
   * @param time - A string like "9am", "3:30pm", etc.
   * @param baseDate - The base date to use
   * @returns A Date object with the correct time
   */
  export function parseTimeString(time: string, baseDate: Date = new Date()): Date {
    const result = new Date(baseDate)
  
    // Remove all spaces and convert to lowercase
    const cleanTime = time.toLowerCase().replace(/\s+/g, "")
  
    // Extract hours, minutes, and AM/PM
    const timeRegex = /^(\d{1,2})(?::(\d{1,2}))?([ap]m)?$/
    const match = cleanTime.match(timeRegex)
  
    if (match) {
      let hours = Number.parseInt(match[1], 10)
      const minutes = match[2] ? Number.parseInt(match[2], 10) : 0
      const isPM = match[3] === "pm"
  
      // Convert to 24-hour format
      if (isPM && hours < 12) {
        hours += 12
      } else if (!isPM && hours === 12) {
        hours = 0
      }
  
      result.setHours(hours, minutes, 0, 0)
      return result
    }
  
    // If we can't parse it, return the original date
    return result
  }
  
  /**
   * Creates a date object from a date reference and time
   * @param dateRef - A string like "today", "tomorrow", "next Monday", etc.
   * @param timeRef - A string like "9am", "3:30pm", etc.
   * @returns A Date object with the correct date and time
   */
  export function createDateTime(dateRef: string, timeRef: string): Date {
    const baseDate = parseRelativeDate(dateRef)
    return parseTimeString(timeRef, baseDate)
  }
  