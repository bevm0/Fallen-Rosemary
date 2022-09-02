import * as trpc from '@trpc/server'
import type { Context } from '../context'

const appRouter = trpc
  .router<Context>()
  .query('getNames', {
    async resolve({ ctx: { database_services } }) {
      const keywords = await database_services.keywords.getAllUnique()
      const names = await database_services.donated_datasets.getAllUnique()

      return { keywords, names }
    },
  })
  .query('hello', {
    resolve: () => 'world',
  })

export type Router = typeof appRouter
export default appRouter
