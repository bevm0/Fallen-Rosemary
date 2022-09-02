import { PrismaClient } from '@prisma/client'

abstract class DatabaseService {
  constructor(readonly prisma: PrismaClient) {}
}

export default DatabaseService
