import { z } from 'zod'

export const FortuneInputSchema = z.object({
  birth: z.object({
    year: z.number().int().min(1900).max(2030),
    month: z.number().int().min(1).max(12),
    day: z.number().int().min(1).max(31),
    hour: z.number().int().min(0).max(23),
    minute: z.number().int().min(0).max(59),
    gender: z.enum(['M', 'F']),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    timeUnknown: z.boolean().optional(),
  }),
  marriageStatus: z.object({
    married: z.boolean(),
    marriageYear: z.number().int().min(1950).max(2030).optional(),
  }),
  pastEvents: z
    .object({
      childhoodHardships: z
        .array(
          z.object({
            year: z.number().int().min(1900).max(2030),
            month: z.number().int().min(1).max(12).optional(),
          })
        )
        .max(3)
        .optional(),
      meetingDates: z
        .array(
          z.object({
            year: z.number().int().min(1900).max(2030),
            month: z.number().int().min(1).max(12).optional(),
          })
        )
        .max(3)
        .optional(),
      breakupDates: z
        .array(
          z.object({
            year: z.number().int().min(1900).max(2030),
            month: z.number().int().min(1).max(12).optional(),
          })
        )
        .max(3)
        .optional(),
    })
    .optional(),
})
