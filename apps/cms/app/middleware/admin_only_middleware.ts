import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AdminOnlyMiddleware {
    async handle(ctx: HttpContext, next: NextFn) {
        const user = ctx.auth.user

        if (!user || user.roleId !== 1) {
            // If not logged in or not Admin (roleId 1)
            // Redirect to admin dashboard (which will be safe/limited) or generic home
            // Or return 403

            // Since Dashboard is also restricted in sidebar, maybe redirect to Posts?
            if (user) {
                return ctx.response.redirect().toRoute('admin_posts_index')
            }

            return ctx.response.unauthorized('You do not have permission to access this page.')
        }

        const output = await next()
        return output
    }
}
