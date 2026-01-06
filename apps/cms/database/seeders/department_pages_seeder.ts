import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Post from '#models/post'
import User from '#models/user'

export default class extends BaseSeeder {
    async run() {
        console.log('--- STARTING DEPARTMENT PAGES SEEDER ---')

        // Ensure we have at least one user to be the author
        let author = await User.first()
        if (!author) {
            console.log('No users found. Creating default admin user...')
            try {
                author = await User.create({
                    fullName: 'Admin',
                    email: 'admin@example.com',
                    password: 'password',
                })
                console.log('Default admin user created.')
            } catch (e) {
                console.error('Failed to create user:', e)
            }
        }

        if (!author) {
            console.error('CRITICAL: Cannot proceed without an author.')
            return
        }

        console.log(`Using author ID: ${author.id}`)

        const departments = [
            {
                title: 'Teknik Komputer Jaringan',
                slug: 'teknik-komputer-jaringan',
                content: '<p>Program Keahlian Teknik Komputer Jaringan (TKJ) membekali siswa dengan keterampilan dalam merakit, menginstalasi, dan memperbaiki komputer serta jaringan komputer. Siswa juga diajarkan tentang administrasi server, keamanan jaringan, dan teknologi cloud computing.</p><h3>Materi Pembelajaran:</h3><ul><li>Perakitan Komputer</li><li>Administrasi Sistem Jaringan</li><li>Administrasi Infrastruktur Jaringan</li><li>Teknologi Layanan Jaringan</li><li>Produk Kreatif dan Kewirausahaan</li></ul>',
            },
            {
                title: 'Teknik Kendaraan Ringan',
                slug: 'teknik-kendaraan-ringan',
                content: '<p>Program Keahlian Teknik Kendaraan Ringan Otomotif (TKRO) fokus pada kompetensi perawatan dan perbaikan kendaraan ringan (mobil). Siswa akan mempelajari mesin bensin dan diesel, sistem kelistrikan bodi, chasis, dan sistem pemindah tenaga.</p><h3>Materi Pembelajaran:</h3><ul><li>Pemeliharaan Mesin Kendaraan Ringan</li><li>Pemeliharaan Sasis dan Pemindah Tenaga</li><li>Pemeliharaan Kelistrikan Kendaraan Ringan</li><li>Gambar Teknik Otomotif</li></ul>',
            },
            {
                title: 'Akuntansi Keuangan',
                slug: 'akuntansi-keuangan',
                content: '<p>Program Keahlian Akuntansi dan Keuangan Lembaga (AKL) menyiapkan siswa untuk menjadi tenaga akuntansi yang profesional. Materi meliputi akuntansi dasar, perbankan dasar, aplikasi pengolah angka (spreadsheet), dan akuntansi perusahaan jasa, dagang, dan manufaktur.</p><h3>Materi Pembelajaran:</h3><ul><li>Akuntansi Dasar</li><li>Komputer Akuntansi (MYOB/Accurate)</li><li>Administrasi Pajak</li><li>Praktikum Akuntansi Perusahaan & Instansi</li></ul>',
            },
            {
                title: 'Teknik Pembangkit Tenaga Listrik',
                slug: 'teknik-pembangkit-tenaga-listrik',
                content: '<p>Program Keahlian Teknik Pembangkit Tenaga Listrik (TPTL) mempelajari tentang proses pembangkitan energi listrik, mulai dari sumber energi, konversi energi, hingga operasional mesin pembangkit. Jurusan ini sangat relevan dengan kebutuhan industri energi masa depan.</p><h3>Materi Pembelajaran:</h3><ul><li>Mesin Pembangkit Tenaga Listrik</li><li>Instalasi Tenaga Listrik</li><li>Kontrol Pembangkitan</li><li>Perawatan Generator dan Transformator</li></ul>',
            }
        ]

        for (const dept of departments) {
            console.log(`Seeding page: ${dept.slug}`)
            try {
                await Post.updateOrCreate(
                    { slug: dept.slug },
                    {
                        ...dept,
                        type: 'page',
                        isPublished: true,
                        authorId: author.id
                    }
                )
            } catch (err) {
                console.error(`Failed to seed ${dept.slug}:`, err)
            }
        }

        console.log('Department pages seeded successfully.')
    }
}
