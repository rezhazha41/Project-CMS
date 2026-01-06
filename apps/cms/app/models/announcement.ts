import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Announcement extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare title: string

    @column()
    declare content: string

    @column()
    declare link: string | null

    @column({ columnName: 'is_active' })
    declare isActive: boolean

    @column.dateTime()
    declare startDate: DateTime | null

    @column.dateTime()
    declare endDate: DateTime | null

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime
}
