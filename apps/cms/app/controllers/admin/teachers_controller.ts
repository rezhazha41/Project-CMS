import type { HttpContext } from '@adonisjs/core/http'
import Post from '#models/post'
import { createPostValidator, updatePostValidator } from '#validators/post'
import Category from '#models/category'

export default class TeachersController {
    async index({ view, request }: HttpContext) {
        const page = request.input('page', 1)
        const teachers = await Post.query()
            .where('type', 'teacher')
            .preload('author')
            .preload('category')
            .orderBy('created_at', 'desc')
            .paginate(page, 10)

        return view.render('pages/admin/teachers/index', { teachers })
    }

    async create({ view }: HttpContext) {
        const categories = await Category.all()
        return view.render('pages/admin/teachers/create', { categories })
    }

    async store({ request, response, auth, session }: HttpContext) {
        const payload = await request.validateUsing(createPostValidator)

        await Post.create({
            ...payload,
            type: 'teacher', // Force type
            authorId: auth.user!.id,
            isPublished: !!payload.isPublished,
        })

        session.flash('success', 'Teacher added successfully')
        return response.redirect().toRoute('admin_teachers_index')
    }

    async edit({ view, params }: HttpContext) {
        const teacher = await Post.findOrFail(params.id)
        if (teacher.type !== 'teacher') {
            return view.render('errors/not_found')
        }
        const categories = await Category.all()
        return view.render('pages/admin/teachers/edit', { teacher, categories })
    }

    async update({ request, response, params, session }: HttpContext) {
        const teacher = await Post.findOrFail(params.id)
        const payload = await request.validateUsing(updatePostValidator)

        teacher.merge({
            ...payload,
            type: 'teacher',
            isPublished: !!payload.isPublished,
        })
        await teacher.save()

        session.flash('success', 'Teacher updated successfully')
        return response.redirect().toRoute('admin_teachers_index')
    }

    async destroy({ params, response, session }: HttpContext) {
        const teacher = await Post.findOrFail(params.id)
        await teacher.delete()

        session.flash('success', 'Teacher deleted successfully')
        return response.redirect().back()
    }
}