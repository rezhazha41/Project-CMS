import type { HttpContext } from '@adonisjs/core/http'
import Feature from '#models/feature'
import vine from '@vinejs/vine'

const featureValidator = vine.compile(
    vine.object({
        title: vine.string().trim().minLength(3).maxLength(255),
        description: vine.string().optional(),
        icon: vine.string().trim(),
        isActive: vine.boolean().optional(),
        order: vine.number().optional(),
    })
)

export default class FeaturesController {
    async index({ view }: HttpContext) {
        const features = await Feature.query().orderBy('order', 'asc').orderBy('created_at', 'desc')
        return view.render('pages/admin/features/index', { features })
    }

    async create({ view }: HttpContext) {
        return view.render('pages/admin/features/create')
    }

    async store({ request, response, session }: HttpContext) {
        const payload = await request.validateUsing(featureValidator)

        await Feature.create({
            ...payload,
            isActive: !!payload.isActive,
            order: payload.order || 0,
        })

        session.flash('success', 'Feature added successfully')
        return response.redirect().toRoute('admin_features_index')
    }

    async edit({ view, params }: HttpContext) {
        const feature = await Feature.findOrFail(params.id)
        return view.render('pages/admin/features/edit', { feature })
    }

    async update({ request, response, params, session }: HttpContext) {
        const feature = await Feature.findOrFail(params.id)
        const payload = await request.validateUsing(featureValidator)

        feature.merge({
            ...payload,
            isActive: !!payload.isActive,
            order: payload.order || 0,
        })
        await feature.save()

        session.flash('success', 'Feature updated successfully')
        return response.redirect().toRoute('admin_features_index')
    }

    async destroy({ params, response, session }: HttpContext) {
        const feature = await Feature.findOrFail(params.id)
        await feature.delete()

        session.flash('success', 'Feature deleted successfully')
        return response.redirect().back()
    }
}
