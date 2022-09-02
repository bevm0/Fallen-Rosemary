import type { Handle } from '@sveltejs/kit'
import { createTRPCHandle } from 'trpc-sveltekit'

// use the trpc server from a different repo
import router from 'server/src/routers'
import createContext from 'server/src/context'

export const handle: Handle = async ({ event, resolve }) => {
  const response = await createTRPCHandle({
    url: '/trpc',
    router,
    createContext,
    event,
    resolve,
  })

  return response
}
