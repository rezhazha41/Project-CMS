import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    await User.updateOrCreate({ email: 'admin@school.com' }, {
      fullName: 'School Admin',
      email: 'admin@school.com',
      password: 'password',
      roleId: 1,
      avatarUrl: 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff'
    })

    // Seed Settings
    const settings = [
      { key: 'site_title', value: 'NAMA WEB', type: 'text' },
      { key: 'site_description', value: 'Mewujudkan Generasi Unggul dan Berakhlak Mulia', type: 'text' },
      { key: 'phone', value: '(021) 1234-5678', type: 'text' },
      { key: 'email', value: 'info@nama-web.sch.id', type: 'text' },
      { key: 'address', value: 'Jl. Pendidikan No. 1, Jakarta', type: 'text' },
      // Theme Settings
      { key: 'theme_color', value: '#059669', type: 'color' }, // Emerald-600
      { key: 'font_family', value: 'Inter', type: 'select' },

      // Contact & Socials
      { key: 'map_url', value: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126932.61869894458!2d106.736636!3d-6.183753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f436b8c94b07%3A0x6ea0d539d5d14dba!2sJakarta%2C%20Indonesia!5e0!3m2!1sen!2sid!4v1650000000000!5m2!1sen!2sid', type: 'text' },
      { key: 'social_facebook', value: '#', type: 'text' },
      { key: 'social_instagram', value: '#', type: 'text' },
      { key: 'social_youtube', value: '#', type: 'text' },

      // Homepage Customization
      { key: 'hero_title', value: 'Mewujudkan Generasi Unggul & Berakhlak', type: 'text' },
      { key: 'hero_description', value: 'NAMA WEB mempersiapkan siswa dengan keterampilan modern dan karakter kuat.', type: 'textarea' },
      { key: 'hero_image', value: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000', type: 'image' },

      // Admin Theme
      { key: 'admin_theme_color', value: '#1F2937', type: 'color' },
    ]

    for (const setting of settings) {
      // @ts-ignore
      await import('#models/setting').then(m => m.default.updateOrCreate({ key: setting.key }, setting))
    }

    // Seed Default Announcement
    const Announcement = (await import('#models/announcement')).default
    await Announcement.updateOrCreate({ title: 'Penerimaan Siswa Baru' }, {
      title: 'Penerimaan Siswa Baru',
      content: 'Penerimaan Siswa Baru Tahun Ajaran 2026/2027 Telah Dibuka!',
      link: '/ppdb',
      isActive: true,
    })

    // Seed Posts (Agenda & Teachers)
    const Post = (await import('#models/post')).default

    // Agendas
    await Post.updateOrCreate({ slug: 'ujian-akhir-semester-genap' }, {
      title: 'Ujian Akhir Semester Genap',
      slug: 'ujian-akhir-semester-genap',
      content: 'Pelaksanaan ujian akhir semester genap tahun ajaran 2025/2026.',
      type: 'agenda',
      isPublished: true,
      publishedAt: DateTime.now(),
      authorId: (await User.first())?.id,
    })

    await Post.updateOrCreate({ slug: 'rapat-wali-murid' }, {
      title: 'Rapat Wali Murid',
      slug: 'rapat-wali-murid',
      content: 'Pengambilan raport semester genap.',
      type: 'agenda',
      isPublished: true,
      publishedAt: DateTime.now(),
      authorId: (await User.first())?.id,
    })

    // Featured Teachers
    await Post.updateOrCreate({ slug: 'budi-santoso' }, {
      title: 'Global Teachers, S.Kom',
      slug: 'budi-santoso',
      content: 'Kepala Program Keahlian RPL. Ahli dalam Fullstack Development.',
      excerpt: 'Kaprog RPL',
      type: 'teacher',
      featuredImage: 'https://ui-avatars.com/api/?name=Budi+Santoso&background=random',
      isPublished: true,
      publishedAt: DateTime.now(),
      authorId: (await User.first())?.id,
    })

    await Post.updateOrCreate({ slug: 'siti-aminah' }, {
      title: 'Siti Aminah, M.Pd',
      slug: 'siti-aminah',
      content: 'Guru Bahasa Inggris & Koordinator Kurikulum.',
      excerpt: 'Koordinator Kurikulum',
      type: 'teacher',
      featuredImage: 'https://ui-avatars.com/api/?name=Siti+Aminah&background=random',
      isPublished: true,
      publishedAt: DateTime.now(),
      authorId: (await User.first())?.id,
    })
  }
}