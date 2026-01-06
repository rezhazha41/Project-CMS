import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'posts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.string('title').notNullable()
      table.string('slug').notNullable().unique()
      table.text('content').nullable()
      table.text('excerpt').nullable()
      table.boolean('is_published').defaultTo(false)
      table.timestamp('published_at').nullable()

      table.uuid('author_id').references('id').inTable('users').onDelete('SET NULL')
      table.integer('category_id').unsigned().references('id').inTable('categories').onDelete('SET NULL')

      table.string('featured_image').nullable()
      table.string('type').defaultTo('post') // post, page, agenda

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}