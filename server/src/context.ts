import prisma_pkg from '@prisma/client'
import * as trpc from '@trpc/server'
import database_services from './services/database'

const { PrismaClient } = prisma_pkg
const prisma = new PrismaClient()

const createContext = async () => ({
  prisma,
  database_services: await database_services(prisma),
})

export type Context = trpc.inferAsyncReturnType<typeof createContext>

export default createContext
