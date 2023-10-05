/* eslint-disable camelcase */
import { FastifyInstance } from 'fastify'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import md5 from 'md5'

import { knex } from '../database'
import { env } from '../env'

export async function authRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createAuthBodySchema = z.object({
      email: z.string().trim().min(1),
      password: z.string().trim().min(1),
    })

    const parsedBody = createAuthBodySchema.safeParse(request.body)

    if (!parsedBody.success) {
      return reply.status(422).send({
        error: {
          fieldErrors: parsedBody.error.flatten().fieldErrors,
        },
      })
    }

    const { email, password } = parsedBody.data

    const user = await knex('users')
      .where({
        email,
        password: md5(password),
      })
      .select()

    if (user.length === 0) {
      return reply.status(422).send({
        error: 'Wrong user or password.',
      })
    }

    const token = jwt.sign({ id: user[0].id }, env.TOKEN_SECRET, {
      expiresIn: '5m',
    })
    const refreshToken = jwt.sign(
      { id: user[0].id },
      env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: '1d',
      },
    )

    reply.status(201).send({ token, refreshToken })
  })

  app.post('/refresh', async (request, reply) => {
    const refreshBodySchema = z.object({
      access_token: z.string().trim().min(1),
    })

    const parsedBody = refreshBodySchema.safeParse(request.body)

    if (!parsedBody.success) {
      return reply.status(422).send({
        error: {
          fieldErrors: parsedBody.error.flatten().fieldErrors,
        },
      })
    }

    const { access_token } = parsedBody.data

    jwt.verify(access_token, env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err || !decoded)
        return reply.status(422).send({
          error: 'Invalid token.',
        })

      const { id } = decoded as { id: string }

      const token = jwt.sign({ id }, env.TOKEN_SECRET, {
        expiresIn: '5m',
      })
      const refreshToken = jwt.sign({ id }, env.REFRESH_TOKEN_SECRET, {
        expiresIn: '1d',
      })

      reply.status(201).send({ token, refreshToken })
    })
  })
}
