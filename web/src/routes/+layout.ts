import trpc from '../lib/trpc'
import type { Load } from '@sveltejs/kit'

export const load: Load = async ({ fetch }) => {
  const names = await trpc(fetch).query('getNames')
  return {
    names,
  }
}
