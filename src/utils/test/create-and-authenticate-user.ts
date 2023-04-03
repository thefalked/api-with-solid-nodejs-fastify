import { FastifyInstance } from 'fastify'
import request from 'supertest'

interface CreateAndAuthenticateUserResponse {
  token: string
}

export const createAndAuthenticateUser = async (
  app: FastifyInstance,
): Promise<CreateAndAuthenticateUserResponse> => {
  await request(app.server).post('/users').send({
    name: 'John Doe',
    email: 'john.doe@gmail.com',
    password: '123456',
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'john.doe@gmail.com',
    password: '123456',
  })

  const { token } = authResponse.body

  return {
    token,
  }
}
