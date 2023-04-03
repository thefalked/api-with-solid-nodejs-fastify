import { FastifyReply, FastifyRequest } from 'fastify'

export async function refresh(req: FastifyRequest, reply: FastifyReply) {
  await req.jwtVerify({ onlyCookie: true })

  const { sub: userId, role } = req.user

  const token = await reply.jwtSign(
    {
      role,
    },
    {
      sign: {
        sub: userId,
      },
    },
  )

  const refreshToken = await reply.jwtSign(
    {
      role,
    },
    {
      sign: {
        sub: userId,
        expiresIn: '7d',
      },
    },
  )

  return reply
    .status(200)
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .send({
      token,
    })
}
