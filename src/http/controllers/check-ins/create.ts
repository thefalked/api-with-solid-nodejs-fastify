import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case'

export async function create(req: FastifyRequest, reply: FastifyReply) {
  const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  })

  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { sub: userId } = req.user
  const { gymId } = createCheckInParamsSchema.parse(req.params)
  const { latitude, longitude } = createCheckInBodySchema.parse(req.body)

  const createCheckInUseCase = makeCheckInUseCase()

  await createCheckInUseCase.execute({
    userId,
    gymId,
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(201).send()
}
