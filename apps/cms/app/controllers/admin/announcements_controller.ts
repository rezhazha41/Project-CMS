import type { HttpContext } from '@adonisjs/core/http'
import Announcement from '#models/announcement'
import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

const announcementValidator = vine.compile(
    vine.object({
        title: vine.string().trim().minLength(3).maxLength(255),
        content: vine.string().trim(),
        link: vine.string().optional(),
        isActive: vine.boolean().optional(),
        startDate: vine.date().optional(),
        endDate: vine.date().optional(),
    })
)

export default class AnnouncementsController {
    async index({ view }: HttpContext) {
        const announcements = await Announcement.query().orderBy('created_at', 'desc')
        return view.render('pages/admin/announcements/index', { announcements })
    }

    async create({ view }: HttpContext) {
        return view.render('pages/admin/announcements/create')
    }

    async store({ request, response, session }: HttpContext) {
        const payload = await request.validateUsing(announcementValidator)

        await Announcement.create({
            title: payload.title,
            content: payload.content,
            link: payload.link,
            isActive: !!payload.isActive,
            startDate: payload.startDate ? DateTime.fromJSDate(payload.startDate) : null,
            endDate: payload.endDate ? DateTime.fromJSDate(payload.endDate) : null,
        })

        session.flash('success', 'Announcement created successfully')
        return response.redirect().toRoute('admin_announcements_index')
    }

    async edit({ view, params }: HttpContext) {
        const announcement = await Announcement.findOrFail(params.id)
        return view.render('pages/admin/announcements/edit', { announcement })
    }

    async update({ request, response, params, session }: HttpContext) {
        const announcement = await Announcement.findOrFail(params.id)
        const payload = await request.validateUsing(announcementValidator)

        announcement.merge({
            title: payload.title,
            content: payload.content,
            link: payload.link,
            isActive: !!payload.isActive,
            startDate: payload.startDate ? DateTime.fromJSDate(payload.startDate) : null,
            endDate: payload.endDate ? DateTime.fromJSDate(payload.endDate) : null,
        })
        await announcement.save()

        session.flash('success', 'Announcement updated successfully')
        return response.redirect().toRoute('admin_announcements_index')
    }

    async destroy({ params, response, session }: HttpContext) {
        const announcement = await Announcement.findOrFail(params.id)
        await announcement.delete()

        session.flash('success', 'Announcement deleted successfully')
        return response.redirect().back()
    }
    async toggleActive({ params, response, session }: HttpContext) {
        const announcement = await Announcement.findOrFail(params.id)
        announcement.isActive = !announcement.isActive
        await announcement.save()

        session.flash('success', `Announcement ${announcement.isActive ? 'activated' : 'deactivated'}`)
        return response.redirect().back()
    }
}
