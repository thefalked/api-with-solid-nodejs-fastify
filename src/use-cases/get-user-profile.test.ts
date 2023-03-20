import { hash } from 'bcryptjs'
import { describe, it, expect, beforeEach } from 'vitest'

import { InMemoryUsersRepository } from '@/repositories/in-memory/users-repository'

import { ResourceNotFoundError } from './errors/resource-not-found-error'

import { GetUserProfileUseCase } from './get-user-profile'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get User Profile Use Case', async () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it('should be able to get user profile', async () => {
    const user = await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhon.doe@mail.com',
      password_hash: await hash('123456', 6),
    })

    const registerResponse = await sut.execute({
      userId: user.id,
    })

    expect(registerResponse).toEqual(
      expect.objectContaining({
        user: expect.objectContaining({
          id: expect.any(String),
          name: 'Jhon Doe',
          email: 'jhon.doe@mail.com',
          password_hash: expect.any(String),
          created_at: expect.any(Date),
        }),
      }),
    )
  })

  it('should not be able to get user profile with wrong id', async () => {
    expect(() =>
      sut.execute({
        userId: 'non-existent-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
