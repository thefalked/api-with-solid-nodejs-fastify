import crypto from 'node:crypto'
import { Gym, Prisma } from '@prisma/client'

import { FindManyNearbyParams, GymsRepository } from '../gyms-respository'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordiantes'

export class InMemoryGymsRepository implements GymsRepository {
  public gyms: Gym[] = []

  async findById(id: string) {
    return this.gyms.find((gym) => gym.id === id) ?? null
  }

  async findManyNearby(userLocation: FindManyNearbyParams): Promise<Gym[]> {
    return this.gyms.filter((gym) => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
        },
        {
          latitude: gym.latitude.toNumber(),
          longitude: gym.longitude.toNumber(),
        },
      )

      return distance < 10
    })
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    return this.gyms
      .filter((gym) => gym.title.includes(query))
      .slice((page - 1) * 20, page * 20)
  }

  async create(data: Prisma.GymCreateInput) {
    const gym: Gym = {
      id: data.id ?? crypto.randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(String(data.latitude)),
      longitude: new Prisma.Decimal(String(data.longitude)),
    }

    this.gyms.push(gym)

    return gym
  }
}
