import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import Setting from '#models/setting'
import Category from '#models/category'
import Announcement from '#models/announcement'
import Activity from '#models/activity'
import { DateTime } from 'luxon'

export default class LoadSettingsMiddleware {
  async handle({ view }: HttpContext, next: NextFn) {
    try {
      const settingsList = await Setting.all()
      const settings = settingsList.reduce((acc: Record<string, string>, curr) => ({ ...acc, [curr.key]: String(curr.value || '') }), {})

      const globalCategories = await Category.all()

      // Fetch active announcement
      const now = DateTime.now()
      const activeAnnouncement = await Announcement.query()
        .where('is_active', true)
        // .where((query) => {
        //   query.whereNull('start_date').orWhere('start_date', '<=', now.toSQL())
        // })
        // .where((query) => {
        //   query.whereNull('end_date').orWhere('end_date', '>=', now.toSQL())
        // })
        .orderBy('created_at', 'desc')
        .first()

      console.log('--- DEBUG ANNOUNCEMENT ---')
      console.log('Now:', now.toString())
      console.log('Active Announcement:', activeAnnouncement?.toJSON())
      console.log('--------------------------')

      console.log('--------------------------')

      // Fetch active activities for homepage
      const schoolActivities = await Activity.query()
        .where('is_active', true)
        .orderBy('created_at', 'desc')
        .limit(6)

      // Fetch Global Menu (Recursive Tree)
      const Menu = (await import('#models/menu')).default
      const allMenus = await Menu.query().where('is_active', true).orderBy('order', 'asc')

      const buildTree = (items: any[], parentId: number | null = null): any[] => {
        return items
          .filter(item => {
            // Handle both Model instance (parentId) and potentially serialized JSON (parentId or parent_id)
            const itemParentId = item.parentId !== undefined ? item.parentId : item.parent_id
            return itemParentId === parentId
          })
          .map(item => {
            // If item is model, toJSON() it. If already object, keep it.
            const jsonItem = typeof item.toJSON === 'function' ? item.toJSON() : item
            return {
              ...jsonItem,
              children: buildTree(items, jsonItem.id)
            }
          })
      }

      const globalMenu = buildTree(allMenus)

      view.share({ settings, globalCategories, activeAnnouncement, schoolActivities, globalMenu })
    } catch (error) {
      // Fallback if DB not ready
      console.error('Middleware Error:', error)
      view.share({ settings: {}, globalCategories: [], activeAnnouncement: null, schoolActivities: [] })
    }
    await next()
  }
}