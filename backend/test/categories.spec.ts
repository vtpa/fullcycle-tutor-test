import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { execSync } from 'node:child_process'
import { app } from '../src/app'

describe('Categories routes', () => {
  beforeAll(async () => {
    execSync('npm run knex -- migrate:latest')
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex -- migrate:rollback --all')
    execSync('npm run knex -- migrate:latest')
  })

  it('should be able to create a new category', async () => {
    await request(app.server).post('/users').send({
      email: 'admin@user.com',
      password: '123456',
    })
    const newAuth = await request(app.server).post('/auth').send({
      email: 'admin@user.com',
      password: '123456',
    })

    const { token } = newAuth.body as unknown as { token: string }

    await request(app.server)
      .post('/categories')
      .set('Authorization', 'Bearer ' + token)
      .send({
        name: 'Awesome category',
      })
      .expect(201)
  })

  it('should not be able to create a new category with a name as a empty string', async () => {
    await request(app.server).post('/users').send({
      email: 'admin@user.com',
      password: '123456',
    })
    const newAuth = await request(app.server).post('/auth').send({
      email: 'admin@user.com',
      password: '123456',
    })

    const { token } = newAuth.body as unknown as { token: string }

    await request(app.server)
      .post('/categories')
      .set('Authorization', 'Bearer ' + token)
      .send({
        name: '',
      })
      .expect(422)
  })

  it('should not be able to create a new category without a name', async () => {
    await request(app.server).post('/users').send({
      email: 'admin@user.com',
      password: '123456',
    })
    const newAuth = await request(app.server).post('/auth').send({
      email: 'admin@user.com',
      password: '123456',
    })

    const { token } = newAuth.body as unknown as { token: string }

    await request(app.server)
      .post('/categories')
      .set('Authorization', 'Bearer ' + token)
      .send({})
      .expect(422)
  })

  it('should be able to list categories', async () => {
    await request(app.server).post('/users').send({
      email: 'admin@user.com',
      password: '123456',
    })
    const newAuth = await request(app.server).post('/auth').send({
      email: 'admin@user.com',
      password: '123456',
    })

    const { token } = newAuth.body as unknown as { token: string }

    await request(app.server)
      .post('/categories')
      .set('Authorization', 'Bearer ' + token)
      .send({
        name: 'Awesome category 001',
      })
    await request(app.server)
      .post('/categories')
      .set('Authorization', 'Bearer ' + token)
      .send({
        name: 'Awesome category 002',
      })

    await request(app.server)
      .get('/categories')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then((response) => {
        expect(response.body).length(2)
      })
  })
})
