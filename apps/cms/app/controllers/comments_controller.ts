import type { HttpContext } from '@adonisjs/core/http'
import Comment from '#models/comment'

export default class CommentsController {
    async store({ request, response, session }: HttpContext) {
        const payload = request.only(['postId', 'name', 'email', 'content'])

        // Auto-approve by default as per schema default
        await Comment.create({
            ...payload,
            isApproved: false // Set to false to trigger notification
        })

        session.flash('success', 'Komentar berhasil dikirim dan menunggu persetujuan admin!')
        return response.redirect().back()
    }
}
