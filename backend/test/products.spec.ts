import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { execSync } from 'node:child_process'
import { app } from '../src/app'
import { randomUUID } from 'node:crypto'

describe('Product routes', () => {
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

  it('should be able to create a new product', async () => {
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

    await request(app.server)
      .post('/products')
      .set('Authorization', 'Bearer ' + token)
      .send({
        name: 'Awesome product',
        category_id: newCategory.body.id,
      })
      .expect(201)
  })

  it('should not be able to create a new product with a name as a empty string', async () => {
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
      .post('/products')
      .set('Authorization', 'Bearer ' + token)
      .send({
        name: '',
      })
      .expect(422)
  })

  it('should not be able to create a new product without a name', async () => {
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
      .post('/products')
      .set('Authorization', 'Bearer ' + token)
      .send({})
      .expect(422)
  })

  it('should not be able to create a new product without a category', async () => {
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
      .post('/products')
      .set('Authorization', 'Bearer ' + token)
      .send({
        name: 'Awesome product',
      })
      .expect(422)
  })

  it('should not be able to create a new product with a inexisting category', async () => {
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
      .post('/products')
      .set('Authorization', 'Bearer ' + token)
      .send({
        name: 'Awesome product',
        category_id: randomUUID(),
      })
      .expect(422)
  })

  it('should be able to list products paginated', async () => {
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

    for (let i = 0; i < 20; i++) {
      await request(app.server)
        .post('/products')
        .set('Authorization', 'Bearer ' + token)
        .send({
          name: `Awesome product ${i + 1}`,
          category_id: newCategory.body.id,
        })
    }

    await request(app.server)
      .get('/products')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).length(15)
        expect(response.body).toHaveProperty('meta')
        expect(response.body.meta).toHaveProperty('page')
        expect(response.body.meta.page).toBe(1)
      })

    await request(app.server)
      .get('/products?page=2')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).length(5)
        expect(response.body).toHaveProperty('meta')
        expect(response.body.meta).toHaveProperty('page')
        expect(response.body.meta.page).toBe(2)
      })
  })

  it('should be able to list a specific product', async () => {
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
      .get(`/products/${newProduct.body.id}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('id')
        expect(response.body.id).toBe(newProduct.body.id)
      })
  })
})
