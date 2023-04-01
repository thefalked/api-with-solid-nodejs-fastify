import crypto from 'node:crypto'
import { CheckIn, Prisma } from '@prisma/client'

import { CheckInsRepository } from '../check-ins-repository'
import dayjs from 'dayjs'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public checkIns: CheckIn[] = []

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    return (
      this.checkIns.find((checkIn) => {
        const checkInDate = dayjs(checkIn.created_at)

        const isOnSameDate =
          checkInDate.isAfter(startOfTheDay) &&
          checkInDate.isBefore(endOfTheDay)

        return checkIn.user_id === userId && isOnSameDate
      }) ?? null
    )
  }

  async findById(id: string) {
    return this.checkIns.find((checkIn) => checkIn.id === id) ?? null
  }

  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    return this.checkIns
      .filter((checkIn) => checkIn.user_id === userId)
      .slice((page - 1) * 20, page * 20)
  }

  async countByUserId(userId: string): Promise<number> {
    return this.checkIns.filter((checkIn) => checkIn.user_id === userId).length
  }

  async create(checkIn: Prisma.CheckInUncheckedCreateInput) {
    const user: CheckIn = {
      id: checkIn.id ?? crypto.randomUUID(),
      user_id: checkIn.user_id,
      gym_id: checkIn.gym_id,
      validated_at: checkIn.validated_at
        ? new Date(checkIn.validated_at)
        : null,
      created_at: new Date(),
    }

    this.checkIns.push(user)

    return user
  }

  async save(checkIn: CheckIn) {
    const checkInIndex = this.checkIns.findIndex(
      (checkInSaved) => checkInSaved.id === checkIn.id,
    )

    if (checkInIndex >= 0) {
      this.checkIns[checkInIndex] = checkIn
    }

    return checkIn
  }
}
