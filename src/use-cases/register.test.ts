import { describe, it, expect } from 'vitest'
import { compare } from 'bcryptjs'

import { InMemoryUsersRepository } from '@/repositories/in-memory/users-repository'

import { RegisterUseCase } from './register'
import { UserAlreadyRegisteredError } from './errors/user-already-registered-error'

describe('Register Use Case', async () => {
  it('should register a user', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const registerResponse = await registerUseCase.execute({
      name: 'Jhon Doe',
      email: 'jhon.doe@mail.com',
      password: '123456',
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

  it('should hash password on user registration', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
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
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    await registerUseCase.execute({
      name: 'Jhon Doe',
      email: 'jhon.doe@mail.com',
      password: '123456',
    })

    expect(() =>
      registerUseCase.execute({
        name: 'Jhon Doe',
        email: 'jhon.doe@mail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyRegisteredError)
  })
})
