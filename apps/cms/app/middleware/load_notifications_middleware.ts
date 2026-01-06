import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import Comment from '#models/comment'

export default class LoadNotificationsMiddleware {
    async handle({ view, auth }: HttpContext, next: NextFn) {
        let count = 0

        try {
            if (auth.user) {
                const pendingCommentsCount = await Comment.query()
                    .where('is_approved', false)
                    .count('* as total')
                    .first()

                // @ts-ignore
                count = Number(pendingCommentsCount?.$extras.total || 0)
            }
        } catch (error) {
            console.error('Notification middleware error:', error)
        }

        view.share({
            notifications: {
                pendingCommentsCount: count
            }
        })

        const output = await next()
        return output
    }
}
