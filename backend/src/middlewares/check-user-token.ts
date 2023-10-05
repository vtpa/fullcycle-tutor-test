import { FastifyReply, FastifyRequest } from 'fastify'
import jwt from 'jsonwebtoken'
import { env } from '../env'

export async function checkUserToken(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (!request.headers.authorization) {
    return reply.status(401).send({
      error: 'Unauthorized.',
    })
  }

  jwt.verify(
    request.headers.authorization.replace('Bearer ', ''),
    env.TOKEN_SECRET,
    (err, decoded) => {
      if (err || !decoded) {
        console.error(err)

        return reply.status(401).send({
          error: 'Unauthorized.',
        })
      }
    },
  )
}
