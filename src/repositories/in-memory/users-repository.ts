import crypto from 'node:crypto'
import { Prisma, User } from '@prisma/client'

import { UsersRepository } from '../users-respository'

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = []

  async findByEmail(email: string) {
    return this.users.find((user) => user.email === email) ?? null
  }

  async findById(id: string) {
    return this.users.find((user) => user.id === id) ?? null
  }

  async create(data: Prisma.UserCreateInput) {
    const user: User = {
      id: data.id ?? crypto.randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    }

    this.users.push(user)

    return user
  }
}
