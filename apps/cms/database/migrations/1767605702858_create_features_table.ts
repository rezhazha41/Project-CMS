import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'features'

    async up() {
        if (!(await this.schema.hasTable(this.tableName))) {
            this.schema.createTable(this.tableName, (table) => {
                table.increments('id')
                table.string('title', 255).notNullable()
                table.string('description', 500).nullable()
                table.string('icon', 100).notNullable() // emoji or icon class
                table.boolean('is_active').defaultTo(true)
                table.integer('order').defaultTo(0)
                table.timestamp('created_at')
                table.timestamp('updated_at')
            })
        }
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
