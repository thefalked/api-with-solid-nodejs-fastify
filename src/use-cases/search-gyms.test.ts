import { describe, it, expect, beforeEach } from 'vitest'

import { InMemoryGymsRepository } from '@/repositories/in-memory/gyms-repository'

import { SearchGymUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymUseCase

describe('Search Gyms Use Case', async () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymUseCase(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'Gym one',
      latitude: -27.0747279,
      longitude: -49.4889672,
    })

    await gymsRepository.create({
      title: 'Gym two',
      latitude: -27.0747279,
      longitude: -49.4889672,
    })

    const sutResponse = await sut.execute({
      query: 'Gym',
      page: 1,
    })

    expect(sutResponse.gyms).toHaveLength(2)

    expect(sutResponse).toEqual(
      expect.objectContaining({
        gyms: expect.arrayContaining([
          expect.objectContaining({
            title: 'Gym one',
          }),
          expect.objectContaining({
            title: 'Gym two',
          }),
        ]),
      }),
    )
  })

  it('should be able to search a specific gym', async () => {
    await gymsRepository.create({
      title: 'Gym one',
      latitude: -27.0747279,
      longitude: -49.4889672,
    })

    await gymsRepository.create({
      title: 'Gym two',
      latitude: -27.0747279,
      longitude: -49.4889672,
    })

    const sutResponse = await sut.execute({
      query: 'Gym one',
      page: 1,
    })

    expect(sutResponse.gyms).toHaveLength(1)

    expect(sutResponse).toEqual(
      expect.objectContaining({
        gyms: expect.arrayContaining([
          expect.objectContaining({
            title: 'Gym one',
          }),
        ]),
      }),
    )
  })

  it('should be able to fetch gyms paginated', async () => {
    for (let index = 1; index <= 22; index++) {
      await gymsRepository.create({
        title: `Gym ${index}`,
        latitude: -27.0747279,
        longitude: -49.4889672,
      })
    }

    const sutResponse = await sut.execute({
      query: 'Gym',
      page: 2,
    })

    expect(sutResponse.gyms).toHaveLength(2)

    expect(sutResponse).toEqual(
      expect.objectContaining({
        gyms: expect.arrayContaining([
          expect.objectContaining({
            title: 'Gym 21',
          }),
          expect.objectContaining({
            title: 'Gym 22',
          }),
        ]),
      }),
    )
  })
})
