import * as trpc from '@trpc/server'
import type { Context } from '../context'
import { z } from 'zod'

const appRouter = trpc
  .router<Context>()
  .query('getKeywords', {
    async resolve({ ctx: { database_services } }) {
      const keywords = await database_services.keywords.getAllUnique()

      return keywords
    },
  })
  .query('getDatasetNames', {
    async resolve({ ctx: { database_services } }) {
      const dataset_names = await database_services.donated_datasets.getAllUnique()
      return dataset_names
    },
  })
  .query('getDatasets', {
    input: z
      .object({
        // filter by keyword
        keyword: z.string().optional(),

        // filter by name
        name: z.string().optional(),

        // filter the output
        orderBy: z.string().optional(),
        sort: z.enum(['asc', 'desc']).optional(),
        limit: z.number().optional(),
      })
      .optional(),
    async resolve({ input, ctx: { database_services } }) {
      // generate the parameters and forward it to the database service

      const query = {
        // if client doesn't provide keyword parameter, expand empty object
        // else, expand an object with the operations to filter by keyword
        ...(input?.keyword == null
          ? {}
          : {
              dataset_keywords: {
                some: {
                  keywords: {
                    keyword: input.keyword,
                  },
                },
              },
            }),

        // if client doesn't provide name parameter, expand empty object
        // else, expand an object with the operations to filter by name
        ...(input?.name == null
          ? {}
          : {
              Name: input.name,
            }),
      }

      // dynamic filter can override the default, e.g. NumHits, desc
      const filter = {
        ...(input?.orderBy == null
          ? {}
          : {
              orderBy: {
                // if provided a sort, use that, otherwise desc by default
                [input.orderBy]: input?.sort ?? 'desc',
              },
            }),
      }
      return database_services.donated_datasets.selectDatasets(query, input?.limit, filter)
    },
  })
  .mutation('hello', {
    input: z.string(),
    async resolve() {
      return 'yeet'
    },
  })

export type Router = typeof appRouter
export default appRouter
