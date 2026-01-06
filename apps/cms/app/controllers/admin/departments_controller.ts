import type { HttpContext } from '@adonisjs/core/http'
import Department from '#models/department'
import string from '@adonisjs/core/helpers/string'

export default class DepartmentsController {
    async index({ view, request }: HttpContext) {
        const page = request.input('page', 1)
        const departments = await Department.query()
            .orderBy('created_at', 'desc')
            .paginate(page, 10)

        return view.render('pages/admin/departments/index', { departments })
    }

    async create({ view }: HttpContext) {
        return view.render('pages/admin/departments/create')
    }

    async store({ request, response, session }: HttpContext) {
        const payload = request.only(['name', 'slug', 'description', 'icon', 'color', 'content'])

        // Simple validation or fallback
        if (!payload.name) {
            session.flash('error', 'Name is required')
            return response.redirect().back()
        }

        // Auto-slug if empty
        if (!payload.slug) {
            payload.slug = string.slug(payload.name)
        }

        await Department.create(payload)

        session.flash('success', 'Jurusan created successfully')
        return response.redirect().toRoute('admin_departments_index')
    }

    async edit({ view, params }: HttpContext) {
        const department = await Department.findOrFail(params.id)
        return view.render('pages/admin/departments/edit', { department })
    }

    async update({ request, response, params, session }: HttpContext) {
        const department = await Department.findOrFail(params.id)
        const payload = request.only(['name', 'slug', 'description', 'icon', 'color', 'content'])

        department.merge(payload)
        await department.save()

        session.flash('success', 'Jurusan updated successfully')
        return response.redirect().toRoute('admin_departments_index')
    }

    async destroy({ params, response, session }: HttpContext) {
        const department = await Department.findOrFail(params.id)
        await department.delete()

        session.flash('success', 'Jurusan deleted successfully')
        return response.redirect().back()
    }
}