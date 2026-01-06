import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class AuthMiddleware {
  /**
   * The URL to redirect to, when authentication fails
   */
  redirectTo = '/login'

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    try {
      console.log('[Middleware] Authenticating request to:', ctx.request.url())
      await ctx.auth.authenticateUsing(options.guards, { loginRoute: this.redirectTo })
      console.log('[Middleware] Authentication successful for user:', ctx.auth.user?.id)
      return next()
    } catch (error) {
      console.log('[Middleware] Authentication failed, redirecting to login. URL:', ctx.request.url())
      throw error
    }
  }
}