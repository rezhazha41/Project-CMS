import type { HttpContext } from '@adonisjs/core/http'
import Post from '#models/post'
import { createPostValidator, updatePostValidator } from '#validators/post'
import Category from '#models/category'

export default class PostsController {
    async index({ view, request }: HttpContext) {
        const page = request.input('page', 1)
        const posts = await Post.query()
            .where('type', 'post')
            .preload('author')
            .preload('category')
            .orderBy('created_at', 'desc')
            .paginate(page, 10)

        posts.baseUrl('/admin/posts')

        return view.render('pages/admin/posts/index', { posts })
    }

    async create({ view }: HttpContext) {
        const categories = await Category.all()
        return view.render('pages/admin/posts/create', { categories })
    }

    async store({ request, response, auth, session }: HttpContext) {
        const payload = await request.validateUsing(createPostValidator)

        await Post.create({
            ...payload,
            type: 'post',
            authorId: auth.user!.id,
            isPublished: !!payload.isPublished, // Ensure boolean
        })

        session.flash('success', 'Post created successfully')
        return response.redirect().toRoute('admin_posts_index')
    }

    async edit({ view, params }: HttpContext) {
        const post = await Post.findOrFail(params.id)
        const categories = await Category.all()
        return view.render('pages/admin/posts/edit', { post, categories })
    }

    async update({ request, response, params, session }: HttpContext) {
        const post = await Post.findOrFail(params.id)
        const payload = await request.validateUsing(updatePostValidator)

        post.merge({
            ...payload,
            type: 'post',
            isPublished: !!payload.isPublished,
        })
        await post.save()

        session.flash('success', 'Post updated successfully')
        return response.redirect().toRoute('admin_posts_index')
    }

    async destroy({ params, response, session }: HttpContext) {
        const post = await Post.findOrFail(params.id)
        await post.delete()

        session.flash('success', 'Post deleted successfully')
        return response.redirect().back()
    }
}