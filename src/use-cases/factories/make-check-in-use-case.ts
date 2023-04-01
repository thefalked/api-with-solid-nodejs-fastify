import { PrismaCheckInsRepository } from '@/repositories/prisma/check-ins-repository'
import { PrismaGymsRespository } from '@/repositories/prisma/gyms-repository'

import { CheckInUseCase } from '../check-in'

export function makeCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const gymsRepository = new PrismaGymsRespository()
  const useCase = new CheckInUseCase(checkInsRepository, gymsRepository)

  return useCase
}
