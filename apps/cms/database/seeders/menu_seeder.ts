import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const Menu = (await import('#models/menu')).default

    // Cleanup first
    await Menu.query().delete()

    // 1. Home
    await Menu.create({ label: 'Home', url: '/', order: 1 })

    // 2. Profil Sekolah
    await Menu.create({ label: 'Profil Sekolah', url: '/#profil', order: 2 })

    // 3. Tentang Kami
    await Menu.create({ label: 'Tentang Kami', url: '/pages/tentang-kami', order: 3 })

    // 4. Jurusan (Parent)
    const jurusan = await Menu.create({ label: 'Jurusan', url: '#', order: 4 })

    // 4.x Children
    await Menu.createMany([
      { label: 'Teknik Komputer Jaringan', url: '/pages/teknik-komputer-jaringan', parentId: jurusan.id, order: 1 },
      { label: 'Teknik Kendaraan Ringan', url: '/pages/teknik-kendaraan-ringan', parentId: jurusan.id, order: 2 },
      { label: 'Akuntansi Keuangan', url: '/pages/akuntansi-keuangan', parentId: jurusan.id, order: 3 },
      { label: 'Teknik Pembangkit Listrik', url: '/pages/teknik-pembangkit-tenaga-listrik', parentId: jurusan.id, order: 4 },
    ])

    // 5. Guru
    await Menu.create({ label: 'Guru', url: '/teachers', order: 5 })

    // 6. Berita
    await Menu.create({ label: 'Berita', url: '/blog', order: 6 })

    // 7. Agenda
    await Menu.create({ label: 'Agenda', url: '/agenda', order: 7 })

    // 8. PPDB
    await Menu.create({ label: 'PPDB', url: '/ppdb', order: 8 })
  }
}