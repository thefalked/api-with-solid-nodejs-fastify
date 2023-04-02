import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'

import { UserAlreadyRegisteredError } from '@/use-cases/errors/user-already-registered-error'

export async function register(req: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(req.body)

  try {
    const registerUseCase = makeRegisterUseCase()

    await registerUseCase.execute({ name, email, password })
  } catch (error) {
    if (error instanceof UserAlreadyRegisteredError) {
      return reply.status(409).send({
        message: error.message,
      })
    }

    throw error
  }

  return reply.status(201).send()
}
