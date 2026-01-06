import type { HttpContext } from '@adonisjs/core/http'
import Comment from '#models/comment'

export default class CommentsController {
    async index({ view, request }: HttpContext) {
        const page = request.input('page', 1)
        const limit = 10

        const comments = await Comment.query()
            .preload('post')
            .orderBy('created_at', 'desc')
            .paginate(page, limit)

        comments.baseUrl('/admin/comments')

        return view.render('pages/admin/comments/index', { comments })
    }

    async destroy({ params, response, session }: HttpContext) {
        const comment = await Comment.findOrFail(params.id)
        await comment.delete()

        session.flash('success', 'Komentar berhasil dihapus')
        return response.redirect().back()
    }

    async toggleApproval({ params, response, session }: HttpContext) {
        const comment = await Comment.findOrFail(params.id)
        comment.isApproved = !comment.isApproved
        await comment.save()

        session.flash('success', `Komentar berhasil ${comment.isApproved ? 'disetujui' : 'disembunyikan'}`)
        return response.redirect().back()
    }
}
