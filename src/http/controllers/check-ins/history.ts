import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeFetchUserCheckInsHistoryCase } from '@/use-cases/factories/make-fetch-user-check-ins-history-use-case'

export async function history(req: FastifyRequest, reply: FastifyReply) {
  const checkInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { sub: userId } = req.user
  const { page } = checkInHistoryQuerySchema.parse(req.query)

  const searchGymsUseCase = makeFetchUserCheckInsHistoryCase()

  const { checkIns } = await searchGymsUseCase.execute({
    userId,
    page,
  })

  return reply.status(200).send({
    checkIns,
  })
}
