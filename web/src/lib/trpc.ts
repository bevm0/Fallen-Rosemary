import type { LoadEvent } from '@sveltejs/kit'
import type { Router } from 'server/src/routers'
import * as trpc from '@trpc/client'
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server'

export const yeet = trpc.createTRPCClient<Router>({
  url: '/trpc',
})

export default (loadFetch?: LoadEvent['fetch']) =>
  trpc.createTRPCClient<Router>({
    url: '/trpc',
    ...(loadFetch && { fetch: loadFetch as typeof fetch }),
  })

type Query = keyof Router['_def']['queries']
type Mutation = keyof Router['_def']['mutations']

// Useful types 👇👇👇
export type InferQueryOutput<RouteKey extends Query> = inferProcedureOutput<
  Router['_def']['queries'][RouteKey]
>
export type InferQueryInput<RouteKey extends Query> = inferProcedureInput<
  Router['_def']['queries'][RouteKey]
>

export type InferMutationInput<RouteKey extends Mutation> = inferProcedureInput<
  Router['_def']['mutations'][RouteKey]
>
export type InferMutationOutput<RouteKey extends Mutation> = inferProcedureOutput<
  Router['_def']['mutations'][RouteKey]
>
