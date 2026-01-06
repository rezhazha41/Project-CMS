import type { HttpContext } from '@adonisjs/core/http'
import Setting from '#models/setting'

export default class HeroSettingsController {
    async index({ view }: HttpContext) {
        const heroBadge = await Setting.findBy('key', 'hero_badge')
        const heroTitle = await Setting.findBy('key', 'hero_title')
        const heroDescription = await Setting.findBy('key', 'hero_description')
        const heroImage = await Setting.findBy('key', 'hero_image')

        // Stats
        const stat1Value = await Setting.findBy('key', 'stat1_value')
        const stat1Label = await Setting.findBy('key', 'stat1_label')
        const stat2Value = await Setting.findBy('key', 'stat2_value')
        const stat2Label = await Setting.findBy('key', 'stat2_label')
        const stat3Value = await Setting.findBy('key', 'stat3_value')
        const stat3Label = await Setting.findBy('key', 'stat3_label')

        return view.render('pages/admin/hero_settings/index', {
            heroBadge: heroBadge?.value || '',
            heroTitle: heroTitle?.value || '',
            heroDescription: heroDescription?.value || '',
            heroImage: heroImage?.value || '',
            stat1Value: stat1Value?.value || '1.5k+',
            stat1Label: stat1Label?.value || 'Siswa Aktif',
            stat2Value: stat2Value?.value || '100+',
            stat2Label: stat2Label?.value || 'Guru Terbaik',
            stat3Value: stat3Value?.value || 'A',
            stat3Label: stat3Label?.value || 'Akreditasi',
        })
    }

    async update({ request, response, session }: HttpContext) {
        const heroBadge = (request.input('hero_badge') || '').trim()
        const heroTitle = (request.input('hero_title') || '').trim()
        const heroDescription = (request.input('hero_description') || '').trim()
        const heroImage = (request.input('hero_image') || '').trim()

        // Stats
        const stat1Value = (request.input('stat1_value') || '').trim()
        const stat1Label = (request.input('stat1_label') || '').trim()
        const stat2Value = (request.input('stat2_value') || '').trim()
        const stat2Label = (request.input('stat2_label') || '').trim()
        const stat3Value = (request.input('stat3_value') || '').trim()
        const stat3Label = (request.input('stat3_label') || '').trim()

        // Update each setting individually with explicit values
        await Setting.updateOrCreate(
            { key: 'hero_badge' },
            { key: 'hero_badge', value: heroBadge, type: 'text' }
        )

        await Setting.updateOrCreate(
            { key: 'hero_title' },
            { key: 'hero_title', value: heroTitle, type: 'text' }
        )

        await Setting.updateOrCreate(
            { key: 'hero_description' },
            { key: 'hero_description', value: heroDescription, type: 'textarea' }
        )

        await Setting.updateOrCreate(
            { key: 'hero_image' },
            { key: 'hero_image', value: heroImage, type: 'text' }
        )

        // Stats Updates
        await Setting.updateOrCreate({ key: 'stat1_value' }, { key: 'stat1_value', value: stat1Value, type: 'text' })
        await Setting.updateOrCreate({ key: 'stat1_label' }, { key: 'stat1_label', value: stat1Label, type: 'text' })
        await Setting.updateOrCreate({ key: 'stat2_value' }, { key: 'stat2_value', value: stat2Value, type: 'text' })
        await Setting.updateOrCreate({ key: 'stat2_label' }, { key: 'stat2_label', value: stat2Label, type: 'text' })
        await Setting.updateOrCreate({ key: 'stat3_value' }, { key: 'stat3_value', value: stat3Value, type: 'text' })
        await Setting.updateOrCreate({ key: 'stat3_label' }, { key: 'stat3_label', value: stat3Label, type: 'text' })

        session.flash('success', 'Hero section updated successfully')
        return response.redirect().back()
    }
}
