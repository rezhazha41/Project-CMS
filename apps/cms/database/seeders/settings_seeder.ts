import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Setting from '#models/setting'

export default class extends BaseSeeder {
    async run() {
        console.log('--- SEEDING SETTINGS (FIX MAPS & SOCIALS) ---')

        const settings = [
            { key: 'site_title', value: 'NAMA WEB' },
            { key: 'email', value: 'admin@nama-web.sch.id' },
            { key: 'phone', value: '(021) 9999-8888' },
            { key: 'address', value: 'Jl. Raya Pendidikan No. 123, Jakarta Selatan' },
            { key: 'social_facebook', value: 'https://facebook.com' },
            { key: 'social_instagram', value: 'https://instagram.com' },
            { key: 'social_youtube', value: 'https://youtube.com' },
            // Valid Google Maps Embed URL
            { key: 'map_url', value: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126932.35515321356!2d106.7327914041724!3d-6.182441999999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f436b8c94b07%3A0x6ea6d5398b7c82f6!2sCentral%20Jakarta%2C%20Central%20Jakarta%20City%2C%20Jakarta!5e0!3m2!1sen!2sid!4v1703000000000!5m2!1sen!2sid' }
        ]

        for (const s of settings) {
            await Setting.updateOrCreate(
                { key: s.key },
                { value: s.value, type: 'text' }
            )
        }

        console.log('Settings seeded.')
    }
}
