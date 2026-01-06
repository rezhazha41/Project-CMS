import type { HttpContext } from '@adonisjs/core/http'
import Media from '#models/media'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'

export default class MediaController {
    async index({ view, request, response }: HttpContext) {
        const media = await Media.query().orderBy('created_at', 'desc')

        if (request.header('accept')?.includes('application/json') || request.ajax()) {
            return response.json(media)
        }

        return view.render('pages/admin/media/index', { media })
    }

    async upload({ request, response, session }: HttpContext) {
        const file = request.file('file', {
            size: '10mb',
            extnames: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico']
        })

        if (!file) {
            session.flash('error', 'Please select a file to upload')
            return response.redirect().back()
        }

        if (!file.isValid) {
            session.flash('error', file.errors[0].message)
            return response.redirect().back()
        }

        // Generate unique filename
        const fileName = `${cuid()}.${file.extname}`

        // Move file to public/uploads
        await file.move(app.makePath('public/uploads'), {
            name: fileName
        })

        // Save to database
        await Media.create({
            filename: fileName,
            originalName: file.clientName,
            mimeType: file.type || 'application/octet-stream',
            size: file.size,
            path: `public/uploads/${fileName}`,
            url: `/uploads/${fileName}`
        })

        session.flash('success', 'File uploaded successfully')
        return response.redirect().back()
    }

    async destroy({ params, response, session }: HttpContext) {
        const media = await Media.findOrFail(params.id)

        // Delete file from disk
        const fs = await import('node:fs/promises')
        try {
            await fs.unlink(app.makePath(media.path))
        } catch (error) {
            // File might not exist, continue anyway
        }

        await media.delete()

        session.flash('success', 'Media deleted successfully')
        return response.redirect().back()
    }
}
