import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Post from '#models/post'
import Media from '#models/media'
import ActivityLog from '#models/activity_log'

export default class DashboardController {
    async index({ view }: HttpContext) {
        // Fetch Real Stats
        const postsCount = await Post.query().where('type', 'post').count('* as total').first()
        const usersCount = await User.query().count('* as total').first() // Assuming all users
        const pagesCount = await Post.query().where('type', 'page').count('* as total').first()
        // Media might be in 'media' table. If model exists:
        // const mediaCount = await Media.query().count('* as total').first()
        // For now, if Media model usage is uncertain, I'll try generic DB or skip
        // Actually, assuming Media model is standard:
        const mediaCountRaw = await Media.query().count('* as total').first()

        const recentPosts = await Post.query()
            .where('type', 'post')
            .preload('author')
            .orderBy('created_at', 'desc')
            .limit(5)

        const recentLogs = await ActivityLog.query()
            .preload('user')
            .orderBy('created_at', 'desc')
            .limit(5)

        // @ts-ignore
        const stats = {
            posts: postsCount?.$extras.total || 0,
            // @ts-ignore
            users: usersCount?.$extras.total || 0,
            // @ts-ignore
            pages: pagesCount?.$extras.total || 0,
            // @ts-ignore
            media: mediaCountRaw?.$extras.total || 0
        }

        return view.render('pages/admin/dashboard', { stats, recentPosts, recentLogs })
    }

    async quickDraft({ request, response, auth, session }: HttpContext) {
        const { title, content } = request.only(['title', 'content'])

        if (!title) {
            session.flash('error', 'Title is required for Quick Draft.')
            return response.redirect().back()
        }

        const draft = await Post.create({
            title,
            content: content || '',
            type: 'post',
            isPublished: false,
            authorId: auth.user!.id,
            slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4)
        })

        // Log Activity
        await ActivityLog.create({
            userId: auth.user!.id, // Ensure userId is string in model
            action: 'create',
            description: `Created Quick Draft: "${title}"`,
            subjectType: 'posts',
            subjectId: draft.id.toString()
        })

        session.flash('success', 'Quick Draft saved successfully!')
        return response.redirect().back()
    }
}