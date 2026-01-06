import type { HttpContext } from '@adonisjs/core/http'
import Setting from '#models/setting'

export default class SettingsController {
    async index({ view }: HttpContext) {
        const settingsList = await Setting.all()
        const settings = settingsList.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {})

        return view.render('pages/admin/settings/index', { settings })
    }

    async update({ request, response, session }: HttpContext) {
        const data = request.except(['_csrf', '_method'])

        for (const [key, value] of Object.entries(data)) {
            // Sanitize value - trim whitespace and ensure clean string
            let cleanValue = String(value || '').trim()

            // Auto-prepend https:// for social links if missing
            if (['social_facebook', 'social_instagram', 'social_youtube'].includes(key) && cleanValue) {
                if (!cleanValue.startsWith('http')) {
                    cleanValue = 'https://' + cleanValue
                }
            }

            // Find existing setting
            const existing = await Setting.findBy('key', key)

            if (existing) {
                // Update existing - replace value completely
                existing.value = cleanValue
                existing.type = 'text' // or determine type based on key
                await existing.save()
            } else {
                // Create new
                await Setting.create({ key, value: cleanValue, type: 'text' })
            }
        }

        session.flash('success', 'Settings updated successfully')
        return response.redirect().back()
    }
}