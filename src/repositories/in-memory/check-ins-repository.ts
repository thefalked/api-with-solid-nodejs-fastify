import crypto from 'node:crypto'
import { CheckIn, Prisma } from '@prisma/client'

import { CheckInsRepository } from '../check-ins-repository'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public checkIns: CheckIn[] = []

  async findByUserIdOnDate(userId: string, date: Date) {
    return this.checkIns.find((checkIn) => checkIn.user_id === userId) ?? null
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const user: CheckIn = {
      id: data.id ?? crypto.randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    }

    this.checkIns.push(user)

    return user
  }
}
