import { describe, it, expect, beforeEach } from 'vitest'
import { Prisma } from '@prisma/client'

import { InMemoryGymsRepository } from '@/repositories/in-memory/gyms-repository'

import { CreateGymUseCase } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', async () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should create a gym', async () => {
    const sutResponse = await sut.execute({
      title: 'Gym Test',
      latitude: -27.0747279,
      longitude: -49.4889672,
    })

    expect(sutResponse).toStrictEqual(
      expect.objectContaining({
        gym: expect.objectContaining({
          id: expect.any(String),
          title: 'Gym Test',
          description: null,
          phone: null,
          latitude: expect.any(Prisma.Decimal),
          longitude: expect.any(Prisma.Decimal),
        }),
      }),
    )
  })
})
