import { PrismaClient } from '@prisma/client'
import DonatedDatasetsService from './donated_datasets'
import KeywordsService from './keywords'

// abstraction of the database into services
export default async (prisma: PrismaClient) => {
  return {
    keywords: new KeywordsService(prisma),
    donated_datasets: new DonatedDatasetsService(prisma),
  }
}
