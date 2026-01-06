import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import ActivityLog from '#models/activity_log'

export default class UsersController {
    async index({ view, request }: HttpContext) {
        const page = request.input('page', 1)
        const users = await User.query().orderBy('created_at', 'desc').paginate(page, 10)
        return view.render('pages/admin/users/index', { users })
    }

    async create({ view }: HttpContext) {
        return view.render('pages/admin/users/create')
    }

    async store({ request, response, session, auth }: HttpContext) {
        const payload = request.only(['fullName', 'email', 'password', 'roleId', 'avatarUrl'])

        // Basic validation could be added here or via validator
        const user = await User.create({
            fullName: payload.fullName,
            email: payload.email,
            password: payload.password,
            roleId: payload.roleId || 2, // Default Editor
            avatarUrl: payload.avatarUrl
        })

        // Log Activity
        await ActivityLog.create({
            userId: auth.user!.id,
            action: 'create',
            description: `Created new user: ${user.fullName} (${user.email})`,
            subjectType: 'users',
            subjectId: user.id
        })

        session.flash('success', 'User created successfully')
        return response.redirect().toRoute('admin_users_index')
    }

    async edit({ view, params }: HttpContext) {
        const user = await User.findOrFail(params.id)
        return view.render('pages/admin/users/edit', { user })
    }

    async update({ request, response, params, session, auth }: HttpContext) {
        const user = await User.findOrFail(params.id)
        const payload = request.only(['fullName', 'email', 'password', 'roleId', 'avatarUrl'])

        user.fullName = payload.fullName
        user.email = payload.email
        if (payload.password) {
            user.password = payload.password
        }
        user.roleId = payload.roleId
        user.avatarUrl = payload.avatarUrl

        await user.save()

        // Log Activity
        await ActivityLog.create({
            userId: auth.user!.id,
            action: 'update',
            description: `Updated user profile: ${user.fullName}`,
            subjectType: 'users',
            subjectId: user.id
        })

        session.flash('success', 'User updated successfully')
        return response.redirect().toRoute('admin_users_index')
    }

    async destroy({ params, response, session, auth }: HttpContext) {
        const user = await User.findOrFail(params.id)

        // Prevent deleting self
        if (user.id === auth.user!.id) {
            session.flash('error', 'You cannot delete your own account.')
            return response.redirect().back()
        }

        await user.delete()

        // Log Activity
        await ActivityLog.create({
            userId: auth.user!.id,
            action: 'delete',
            description: `Deleted user: ${user.fullName}`,
            subjectType: 'users',
            subjectId: user.id
        })

        session.flash('success', 'User deleted successfully')
        return response.redirect().back()
    }
}