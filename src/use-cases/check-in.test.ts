import { describe, it, expect, beforeEach } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/check-ins-repository'

import { CheckInUseCase } from './check-in'

let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', async () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckInUseCase(checkInsRepository)
  })

  it('should be able to check in', async () => {
    const sutResponse = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
    })

    expect(sutResponse).toEqual(
      expect.objectContaining({
        checkIn: expect.objectContaining({
          id: expect.any(String),
          gym_id: expect.any(String),
          user_id: expect.any(String),
          validated_at: null,
          created_at: expect.any(Date),
        }),
      }),
    )
  })
})
