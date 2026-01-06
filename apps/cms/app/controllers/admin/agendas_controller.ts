import type { HttpContext } from '@adonisjs/core/http'
import Post from '#models/post'
import { DateTime } from 'luxon'
import string from '@adonisjs/core/helpers/string'

export default class AgendasController {
    /**
     * List all agendas
     */
    async index({ view, request }: HttpContext) {
        const page = request.input('page', 1)

        const agendas = await Post.query()
            .where('type', 'agenda')
            .orderBy('event_date', 'asc') // Sort by event date closest first
            .paginate(page, 10)

        agendas.baseUrl('/admin/agendas')

        return view.render('pages/admin/agendas/index', { agendas })
    }

    /**
     * Show create form
     */
    async create({ view }: HttpContext) {
        return view.render('pages/admin/agendas/create')
    }

    /**
     * Store new agenda
     */
    async store({ request, response, session, auth }: HttpContext) {
        const data = request.only(['title', 'content', 'excerpt', 'event_date', 'event_time', 'is_published'])

        try {
            // Validate event_date if needed (simple check)
            if (!data.event_date) {
                session.flash('error', 'Tanggal acara wajib diisi')
                return response.redirect().back()
            }

            await Post.create({
                title: data.title,
                slug: string.slug(data.title) + '-' + string.random(4),
                content: data.content,
                excerpt: data.excerpt,
                eventDate: DateTime.fromISO(data.event_date), // Use fromISO for date inputs
                eventTime: data.event_time,
                type: 'agenda',
                isPublished: !!data.is_published,
                authorId: auth.user?.id
            })

            session.flash('success', 'Agenda berhasil dibuat')
            return response.redirect().toRoute('admin_agendas_index')
        } catch (error) {
            console.error(error)
            session.flash('error', 'Gagal membuat agenda')
            return response.redirect().back()
        }
    }

    /**
     * Show edit form
     */
    async edit({ view, params, response }: HttpContext) {
        try {
            const agenda = await Post.query()
                .where('id', params.id)
                .where('type', 'agenda')
                .firstOrFail()

            return view.render('pages/admin/agendas/edit', { agenda })
        } catch {
            return response.redirect().toRoute('admin_agendas_index')
        }
    }

    /**
     * Update agenda
     */
    async update({ request, response, session, params }: HttpContext) {
        const data = request.only(['title', 'content', 'excerpt', 'event_date', 'event_time', 'is_published'])

        try {
            const agenda = await Post.findOrFail(params.id)

            agenda.merge({
                title: data.title,
                content: data.content,
                excerpt: data.excerpt,
                eventDate: data.event_date ? DateTime.fromISO(data.event_date) : agenda.eventDate,
                eventTime: data.event_time,
                isPublished: !!data.is_published
            })

            await agenda.save()

            session.flash('success', 'Agenda berhasil diperbarui')
            return response.redirect().toRoute('admin_agendas_index')
        } catch (error) {
            console.error(error)
            session.flash('error', 'Gagal memperbarui agenda')
            return response.redirect().back()
        }
    }

    /**
     * Delete agenda
     */
    async destroy({ params, response, session }: HttpContext) {
        try {
            const agenda = await Post.findOrFail(params.id)
            await agenda.delete()

            session.flash('success', 'Agenda berhasil dihapus')
            return response.redirect().back()
        } catch (error) {
            session.flash('error', 'Gagal menghapus agenda')
            return response.redirect().back()
        }
    }
}