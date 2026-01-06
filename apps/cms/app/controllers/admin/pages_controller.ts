import type { HttpContext } from '@adonisjs/core/http'
import Post from '#models/post'
import { createPostValidator, updatePostValidator } from '#validators/post'
import Category from '#models/category'

export default class PagesController {
    async index({ view, request }: HttpContext) {
        const page = request.input('page', 1)
        const pages = await Post.query()
            .where('type', 'page')
            .preload('author')
            .orderBy('created_at', 'desc')
            .paginate(page, 10)

        return view.render('pages/admin/pages/index', { pages })
    }

    async create({ view }: HttpContext) {
        const categories = await Category.all()
        return view.render('pages/admin/pages/create', { categories })
    }

    async store({ request, response, auth, session }: HttpContext) {
        const payload = await request.validateUsing(createPostValidator)

        await Post.create({
            ...payload,
            type: 'page',
            authorId: auth.user!.id,
            isPublished: !!payload.isPublished,
        })

        session.flash('success', 'Page created successfully')
        return response.redirect().toRoute('admin_pages_index')
    }

    async edit({ view, params }: HttpContext) {
        const page = await Post.findOrFail(params.id)
        if (page.type !== 'page') {
            return view.render('errors/not_found')
        }
        const categories = await Category.all()
        return view.render('pages/admin/pages/edit', { page, categories })
    }

    async update({ request, response, params, session }: HttpContext) {
        const page = await Post.findOrFail(params.id)
        const payload = await request.validateUsing(updatePostValidator)

        page.merge({
            ...payload,
            type: 'page',
            isPublished: !!payload.isPublished,
        })
        await page.save()

        session.flash('success', 'Page updated successfully')
        return response.redirect().toRoute('admin_pages_index')
    }

    async destroy({ params, response, session }: HttpContext) {
        const page = await Post.findOrFail(params.id)
        await page.delete()

        session.flash('success', 'Page deleted successfully')
        return response.redirect().back()
    }
}
