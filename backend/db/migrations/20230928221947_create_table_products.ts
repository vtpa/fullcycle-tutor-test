import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('products', (table) => {
    table.uuid('id').notNullable()
    table
      .uuid('category_id')
      .references('id')
      .inTable('categories')
      .onDelete('CASCADE')
    table.text('name').notNullable()
    table.decimal('quantity', 10, 2).notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('products')
}
