import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Post from '#models/post'
import User from '#models/user'

export default class extends BaseSeeder {
    async run() {
        console.log('--- STARTING STATIC PAGES SEEDER ---')

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

        const pages = [
            {
                title: 'Tentang Kami',
                slug: 'tentang-kami',
                content: `
                    <p>NAMA WEB adalah lembaga pendidikan kejuruan yang berdedikasi untuk mencetak generasi muda yang kompeten, berakhlak mulia, dan siap kerja. Berdiri sejak tahun 2010, kami terus berkembang mengikuti kemajuan teknologi dan kebutuhan industri.</p>
                    
                    <h3>Visi</h3>
                    <p>Menjadi NAMA unggulan yang menghasilkan lulusan berkarakter, kompeten, dan mandiri.</p>

                    <h3>Misi</h3>
                    <ul>
                        <li>Menyelenggarakan pendidikan kejuruan yang berkualitas dan relevan dengan kebutuhan industri.</li>
                        <li>Membentuk peserta didik yang beriman, bertaqwa, dan berakhlak mulia.</li>
                        <li>Mengembangkan jiwa kewirausahaan dan kemandirian peserta didik.</li>
                        <li>Meningkatkan kompetensi pendidik dan tenaga kependidikan.</li>
                    </ul>

                    <h3>Fasilitas</h3>
                    <p>Kami menyediakan fasilitas lengkap untuk menunjang kegiatan belajar mengajar, antara lain:</p>
                    <ul>
                        <li>Laboratorium Komputer Modern</li>
                        <li>Bengkel Otomotif Standar Industri</li>
                        <li>Perpustakaan Digital</li>
                        <li>Masjid Sekolah</li>
                        <li>Lapangan Olahraga</li>
                    </ul>
                `,
            },
            {
                title: 'PPDB',
                slug: 'ppdb',
                content: `
                    <p>Penerimaan Peserta Didik Baru (PPDB) SMK Al Munawwarah Tahun Ajaran 2024/2025 telah dibuka!</p>

                    <h3>Jadwal Pendaftaran</h3>
                    <ul>
                        <li><strong>Gelombang 1:</strong> 1 Januari - 31 Maret 2024</li>
                        <li><strong>Gelombang 2:</strong> 1 April - 30 Juni 2024</li>
                    </ul>

                    <h3>Syarat Pendaftaran</h3>
                    <ol>
                        <li>Mengisi formulir pendaftaran (Online/Offline).</li>
                        <li>Fotokopi Ijazah/SKL SMP/MTs dilegalisir (2 lembar).</li>
                        <li>Fotokopi Kartu Keluarga (KK) & Akta Kelahiran.</li>
                        <li>Pas foto berwarna ukuran 3x4 (4 lembar).</li>
                        <li>Membayar biaya pendaftaran.</li>
                    </ol>

                    <h3>Alur Pendaftaran Online</h3>
                    <ol>
                        <li>Kunjungi website resmi kami atau klik tombol <strong>Daftar Sekarang</strong>.</li>
                        <li>Lengkapi data diri pada formulir online.</li>
                        <li>Upload dokumen persyaratan.</li>
                        <li>Lakukan konfirmasi pembayaran.</li>
                        <li>Cetak bukti pendaftaran dan bawa saat verifikasi berkas.</li>
                    </ol>

                    <p>Segera daftarkan diri Anda dan jadilah bagian dari keluarga besar SMK Al Munawwarah!</p>
                `,
            }
        ]

        for (const page of pages) {
            console.log(`Seeding page: ${page.slug}`)
            try {
                await Post.updateOrCreate(
                    { slug: page.slug },
                    {
                        ...page,
                        type: 'page',
                        isPublished: true,
                        authorId: author.id
                    }
                )
            } catch (err) {
                console.error(`Failed to seed ${page.slug}:`, err)
            }
        }

        console.log('Static pages seeded successfully.')
    }
}
