import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const Department = (await import('#models/department')).default

    await Department.createMany([
      {
        name: 'Teknik Komputer Jaringan',
        slug: 'teknik-komputer-jaringan',
        icon: '🌐',
        color: 'blue',
        description: 'Infrastruktur jaringan, administrasi server, keamanan siber, dan teknologi cloud.',
        content: `
          <h3>Kompetensi Keahlian Teknik Komputer dan Jaringan</h3>
          <p>Teknik Komputer dan Jaringan (TKJ) merupakan salah satu program keahlian yang mempelajari tentang cara merakit komputer dan menginstalasi program komputer serta jaringan.</p>
          <p>Lulusan TKJ memiliki peluang kerja yang luas sebagai:</p>
          <ul>
            <li>Network Administrator</li>
            <li>IT Support</li>
            <li>System Administrator</li>
            <li>Teknisi Komputer</li>
          </ul>
        `
      },
      {
        name: 'Teknik Kendaraan Ringan',
        slug: 'teknik-kendaraan-ringan',
        icon: '🚗',
        color: 'red',
        description: 'Perawatan mesin otomotif modern, sistem injeksi, kelistrikan bodi, dan chasis.',
        content: `
          <h3>Kompetensi Keahlian Teknik Kendaraan Ringan</h3>
          <p>Mempelajari teknik perawatan dan perbaikan kendaraan ringan (mobil). Fokus pada mesin bensin dan diesel.</p>
        `
      },
      {
        name: 'Akuntansi Keuangan',
        slug: 'akuntansi-keuangan',
        icon: '📊',
        color: 'yellow',
        description: 'Akuntansi digital, perpajakan, perbankan syariah, dan manajemen keuangan.',
        content: `
          <h3>Kompetensi Keahlian Akuntansi dan Keuangan Lembaga</h3>
          <p>Membekali siswa dengan kemampuan dalam mengelola transaksi keuangan, menyusun laporan keuangan, dan perpajakan.</p>
        `
      },
      {
        name: 'Teknik Pembangkit Tenaga Listrik',
        slug: 'teknik-pembangkit-tenaga-listrik',
        icon: '⚡',
        color: 'orange',
        description: 'Instalasi tenaga listrik, panel surya, operasional pembangkit, dan energi terbarukan.',
        content: `
          <h3>Kompetensi Keahlian Teknik Pembangkit Tenaga Listrik</h3>
          <p>Fokus pada instalasi, operasi, dan pemeliharaan pembangkit tenaga listrik.</p>
        `
      }
    ])
  }
}