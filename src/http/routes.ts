import { FastifyInstance } from 'fastify'

import { verifyJTW } from './middlewares/verify-jwt'

import { register } from './controller/register'
import { authenticate } from './controller/authenticate'
import { profile } from './controller/profile'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)

  app.post('/sessions', authenticate)

  // Authenticated
  app.get('/me', { onRequest: [verifyJTW] }, profile)
}
