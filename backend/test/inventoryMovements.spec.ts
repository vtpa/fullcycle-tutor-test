import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { execSync } from 'node:child_process'
import { app } from '../src/app'

describe('Inventory Movement routes', () => {
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

  it('should be able to add a quantity', async () => {
    await request(app.server).post('/users').send({
      email: 'admin@user.com',
      password: '123456',
    })
    const newAuth = await request(app.server).post('/auth').send({
      email: 'admin@user.com',
      password: '123456',
    })

    const { token } = newAuth.body as unknown as { token: string }

    const newCategory = await request(app.server)
      .post('/categories')
      .set('Authorization', 'Bearer ' + token)
      .send({
        name: 'Awesome category',
      })

    const newProduct = await request(app.server)
      .post('/products')
      .set('Authorization', 'Bearer ' + token)
      .send({
        name: 'Awesome product',
        category_id: newCategory.body.id,
      })

    await request(app.server)
      .post('/inventory/add')
      .set('Authorization', 'Bearer ' + token)
      .send({
        product_id: newProduct.body.id,
        quantity: 2,
      })
      .expect(201)
      .then((response) => {
        expect(response.body.quantity).toBe(2)
      })
  })

  it('should be able to sub a quantity', async () => {
    await request(app.server).post('/users').send({
      email: 'admin@user.com',
      password: '123456',
    })
    const newAuth = await request(app.server).post('/auth').send({
      email: 'admin@user.com',
      password: '123456',
    })

    const { token } = newAuth.body as unknown as { token: string }

    const newCategory = await request(app.server)
      .post('/categories')
      .set('Authorization', 'Bearer ' + token)
      .send({
        name: 'Awesome category',
      })

    const newProduct = await request(app.server)
      .post('/products')
      .set('Authorization', 'Bearer ' + token)
      .send({
        name: 'Awesome product',
        category_id: newCategory.body.id,
      })

    await request(app.server)
      .post('/inventory/add')
      .set('Authorization', 'Bearer ' + token)
      .send({
        product_id: newProduct.body.id,
        quantity: 2,
      })

    await request(app.server)
      .post('/inventory/sub')
      .set('Authorization', 'Bearer ' + token)
      .send({
        product_id: newProduct.body.id,
        quantity: 1,
      })
      .expect(201)
      .then((response) => {
        expect(response.body.quantity).toBe(1)
      })
  })
})
