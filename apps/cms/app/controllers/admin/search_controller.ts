import type { HttpContext } from '@adonisjs/core/http'
import Post from '#models/post'
import User from '#models/user'

export default class SearchController {
    async index({ request, view }: HttpContext) {
        const query = request.input('q', '')

        if (!query) {
            return view.render('pages/admin/search/index', { query, posts: [], users: [] })
        }

        const posts = await Post.query()
            .whereILike('title', `%${query}%`)
            .orWhereILike('content', `%${query}%`)
            .preload('author')
            .limit(10)

        const users = await User.query()
            .whereILike('fullName', `%${query}%`)
            .orWhereILike('email', `%${query}%`)
            .limit(10)

        // Pages are just posts with type='page'
        // They are included in 'posts' query essentially, but we could separate if needed.
        // For simplicity, we search all Posts (including pages/agendas).

        return view.render('pages/admin/search/index', { query, posts, users })
    }
}
