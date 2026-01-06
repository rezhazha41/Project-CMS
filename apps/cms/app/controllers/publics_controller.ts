import type { HttpContext } from '@adonisjs/core/http'
import Post from '#models/post'

import Department from '#models/department'

export default class PublicsController {
    async home({ view }: HttpContext) {
        const posts = await Post.query()
            .where('is_published', true)
            .where('type', 'post')
            .orderBy('created_at', 'desc')
            .limit(3)
            .preload('author')

        const agendas = await Post.query()
            .where('is_published', true)
            .where('type', 'agenda')
            .orderBy('event_date', 'desc') // Show latest/future events first
            .limit(3)

        // Limit 3 teachers for Home section
        const teachers = await Post.query()
            .where('is_published', true)
            .where('type', 'teacher')
            .orderBy('created_at', 'desc') // or order by specific field if needed
            .limit(3)

        const departments = await Department.query().orderBy('created_at', 'asc')

        return view.render('pages/public/home', { posts, agendas, teachers, departments })
    }

    async blog({ view, request }: HttpContext) {
        const page = request.input('page', 1)
        const categoryId = request.input('category')

        const query = Post.query()
            .where('is_published', true)
            .where('type', 'post')
            .preload('author')
            .preload('category')
            .orderBy('created_at', 'desc')

        if (categoryId) {
            query.where('categoryId', categoryId)
        }

        const posts = await query.paginate(page, 9)

        return view.render('pages/public/blog/index', { posts })
    }

    async agenda({ view, request }: HttpContext) {
        const page = request.input('page', 1)
        const posts = await Post.query()
            .where('is_published', true)
            .where('type', 'agenda') // Ensure strictly agenda
            .orderBy('created_at', 'desc')
            .preload('author')
            .paginate(page, 9)

        // Fetch all agendas for calendar (lightweight)
        const calendarEvents = await Post.query()
            .where('is_published', true)
            .where('type', 'agenda')
            .select('id', 'title', 'slug', 'created_at', 'event_date')

        return view.render('pages/public/agenda/index', { posts, calendarEvents })
    }

    async teachers({ view, request }: HttpContext) {
        const page = request.input('page', 1)
        const teachers = await Post.query()
            .where('is_published', true)
            .where('type', 'teacher')
            .orderBy('created_at', 'desc') // or order by title?
            .paginate(page, 12)

        return view.render('pages/public/teachers/index', { teachers })
    }

    async show({ view, params }: HttpContext) {
        const post = await Post.query()
            .where('slug', params.slug)
            .where('is_published', true)
            .preload('author')
            .preload('category')
            .preload('comments', (query) => {
                query.where('is_approved', true).orderBy('created_at', 'desc')
            })
            .firstOrFail()

        return view.render('pages/public/blog/show', { post })
    }

    async page({ view, params }: HttpContext) {
        const page = await Post.query()
            .where('slug', params.slug)
            .where('type', 'page')
            .where('is_published', true)
            .preload('author')
            .firstOrFail()

        return view.render('pages/public/page', { page })
    }

    async ppdb({ view }: HttpContext) {
        // Try to find PPDB page, or render default
        try {
            const page = await Post.query()
                .where('slug', 'ppdb')
                .where('type', 'page')
                .where('is_published', true)
                .firstOrFail()

            return view.render('pages/public/page', { page })
        } catch {
            // Render default PPDB page if not found
            return view.render('pages/public/ppdb')
        }
    }

    async customPage({ view, params, response }: HttpContext) {
        try {
            const post = await Post.query()
                .where('slug', params.slug)
                .where('is_published', true)
                .firstOrFail()

            // Render based on type
            if (post.type === 'page') {
                return view.render('pages/public/page', { page: post })
            } else {
                return view.render('pages/public/blog/show', { post })
            }
        } catch {
            return response.status(404).send('Page not found')
        }
    }
}