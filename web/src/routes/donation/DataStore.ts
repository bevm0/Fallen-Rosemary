import { MetadataSchema, CreatorSchema } from '$lib/schemas'

import { z } from 'zod'
// initialize form, schema validation
//////////////////////////////////////////
export const BasicInfoSchema = z.object({
  metadata: MetadataSchema.extend({
    Name: z.string().min(1, { message: 'Please enter a dataset name' }),
  }),
  creator: CreatorSchema,
  creators: CreatorSchema.array(),
  keywords: z.string().array(),
})

// forward the export
export { DescriptiveSchema } from '$lib/schemas'
export type { DescriptiveType } from '$lib/schemas/Descriptive'

export type BasicInfoType = z.TypeOf<typeof BasicInfoSchema>
