import { Gym } from '@prisma/client'

import { GymsRepository } from '../gyms-respository'

export class InMemoryGymsRepository implements GymsRepository {
  public gyms: Gym[] = []

  async findById(id: string) {
    return this.gyms.find((gym) => gym.id === id) ?? null
  }
}
