import { z } from "zod";

export const itinerarySchema = z.object({
    destination: z.object({
      city: z.string(),
      country: z.string(),
      bestTimeToVisit: z.string(),
    }),
    tripDetails: z.object({
      duration: z.string(),
      budget: z.string(),
      travelStyle: z.string(),
    }),
    dailyPlans: z.array(
      z.object({
        day: z.number(),
        activities: z.array(
          z.object({
            time: z.string(),
            activity: z.string(),
            location: z.string(),
            notes: z.string().optional(),
          }),
        ),
        accommodation: z.object({
          name: z.string(),
          type: z.string(),
          address: z.string().optional(),
        }),
      }),
    ),
    tips: z.array(z.string()),
  })