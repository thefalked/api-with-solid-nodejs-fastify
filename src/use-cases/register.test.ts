import { compare } from 'bcryptjs'
import { describe, it, expect, beforeEach } from 'vitest'

import { InMemoryUsersRepository } from '@/repositories/in-memory/users-repository'

import { UserAlreadyRegisteredError } from './errors/user-already-registered-error'

import { RegisterUseCase } from './register'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', async () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should register a user', async () => {
    const sutResponse = await sut.execute({
      name: 'Jhon Doe',
      email: 'jhon.doe@mail.com',
      password: '123456',
    })

    expect(sutResponse).toEqual(
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

  it('should hash password on user registration', async () => {
    const { user } = await sut.execute({
      name: 'Jhon Doe',
      email: 'jhon.doe@mail.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    await sut.execute({
      name: 'Jhon Doe',
      email: 'jhon.doe@mail.com',
      password: '123456',
    })

    await expect(() =>
      sut.execute({
        name: 'Jhon Doe',
        email: 'jhon.doe@mail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyRegisteredError)
  })
})
