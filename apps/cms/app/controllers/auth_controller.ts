import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AuthController {
    async showLogin({ view }: HttpContext) {
        return view.render('pages/auth/login')
    }

    async store({ request, auth, response }: HttpContext) {
        const { email, password } = request.only(['email', 'password'])

        try {
            const user = await User.verifyCredentials(email, password)
            await auth.use('web').login(user)
            return response.redirect().toPath('/admin')
        } catch (error) {
            return response.redirect().back()
        }
    }

    async logout({ auth, response }: HttpContext) {
        await auth.use('web').logout()
        return response.redirect().toPath('/login')
    }
}