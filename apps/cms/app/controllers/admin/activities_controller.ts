import type { HttpContext } from '@adonisjs/core/http'
import Activity from '#models/activity'
import vine from '@vinejs/vine'

const activityValidator = vine.compile(
    vine.object({
        title: vine.string().trim().minLength(3).maxLength(255),
        description: vine.string().optional(),
        image: vine.string().trim(),
        isActive: vine.boolean().optional(),
    })
)

export default class ActivitiesController {
    async index({ view }: HttpContext) {
        const activities = await Activity.query().orderBy('created_at', 'desc')
        return view.render('pages/admin/activities/index', { activities })
    }

    async create({ view }: HttpContext) {
        return view.render('pages/admin/activities/create')
    }

    async store({ request, response, session }: HttpContext) {
        const payload = await request.validateUsing(activityValidator)

        await Activity.create({
            ...payload,
            isActive: !!payload.isActive,
        })

        session.flash('success', 'Activity added successfully')
        return response.redirect().toRoute('admin_activities_index')
    }

    async edit({ view, params }: HttpContext) {
        const activity = await Activity.findOrFail(params.id)
        return view.render('pages/admin/activities/edit', { activity })
    }

    async update({ request, response, params, session }: HttpContext) {
        const activity = await Activity.findOrFail(params.id)
        const payload = await request.validateUsing(activityValidator)

        activity.merge({
            ...payload,
            isActive: !!payload.isActive,
        })
        await activity.save()

        session.flash('success', 'Activity updated successfully')
        return response.redirect().toRoute('admin_activities_index')
    }

    async destroy({ params, response, session }: HttpContext) {
        const activity = await Activity.findOrFail(params.id)
        await activity.delete()

        session.flash('success', 'Activity deleted successfully')
        return response.redirect().back()
    }
}
