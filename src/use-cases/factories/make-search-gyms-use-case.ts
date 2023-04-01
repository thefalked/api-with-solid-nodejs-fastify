import { PrismaGymsRespository } from '@/repositories/prisma/gyms-repository'

import { SearchGymUseCase } from '../search-gyms'

export function makeSearchGymsUseCase() {
  const gymsRepository = new PrismaGymsRespository()
  const useCase = new SearchGymUseCase(gymsRepository)

  return useCase
}
