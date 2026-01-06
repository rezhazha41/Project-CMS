import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Category from './category.js'
import Comment from './comment.js'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare title: string

  @column()
  declare slug: string

  @column()
  declare content: string | null

  @column()
  declare excerpt: string | null

  @column()
  declare isPublished: boolean

  @column.dateTime()
  declare publishedAt: DateTime | null

  @column()
  declare authorId: string

  @column()
  declare categoryId: number | null

  @column()
  declare featuredImage: string | null

  @column()
  declare type: string

  @column.date()
  declare eventDate: DateTime | null

  @column()
  declare eventTime: string | null

  @belongsTo(() => User, { foreignKey: 'authorId' })
  declare author: BelongsTo<typeof User>

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>

  @hasMany(() => Comment)
  declare comments: HasMany<typeof Comment>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}