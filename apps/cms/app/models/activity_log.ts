import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class ActivityLog extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare userId: string

    @column()
    declare action: string // e.g., 'create', 'update', 'delete', 'login'

    @column()
    declare description: string // e.g., 'Created new post: "Hello World"'

    @column()
    declare subjectType: string | null // e.g., 'posts', 'users'

    @column()
    declare subjectId: string | null // string to support both number IDs and UUIDs

    @belongsTo(() => User)
    declare user: BelongsTo<typeof User>

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime
}
