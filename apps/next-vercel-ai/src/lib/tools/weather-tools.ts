import { tool } from "ai"
import { z } from "zod"

export const getWeather = tool({
  description: "Get the current weather for a given city",
  parameters: z.object({
    city: z.string().describe("The name of the city to get the weather for"),
    countryCode: z.string().optional().describe("Optional ISO 3166 country code to disambiguate the city"),
  }),
  execute: async ({ city, countryCode }) => {
    const apiKey = process.env.OPENWEATHER_API_KEY
    if (!apiKey) return "Error: API key not found. Please set the OPENWEATHER_API_KEY environment variable."

    const query = countryCode ? `${city},${countryCode}` : city
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(query)}&aqi=yes`

    const res = await fetch(url)
    if (!res.ok) throw new Error(`Failed to fetch weather data: ${res.statusText}`)

    const data = await res.json()

    return data;
  }
})

export type GetWeatherParams = z.infer<typeof getWeather["parameters"]>
