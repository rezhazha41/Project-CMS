import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'media'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('filename', 255).notNullable()
      table.string('original_name', 255).notNullable()
      table.string('mime_type', 100).notNullable()
      table.integer('size').unsigned().notNullable()
      table.string('path', 500).notNullable()
      table.string('url', 500).notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}