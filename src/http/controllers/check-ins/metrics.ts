import { FastifyReply, FastifyRequest } from 'fastify'

import { makeGetUserMetricsUseCase } from '@/use-cases/factories/make-get-user-metrics-use-case'

export async function metrics(req: FastifyRequest, reply: FastifyReply) {
  const { sub: userId } = req.user

  const searchGymsUseCase = makeGetUserMetricsUseCase()

  const { checkInsCount } = await searchGymsUseCase.execute({
    userId,
  })

  return reply.status(200).send({
    checkInsCount,
  })
}
