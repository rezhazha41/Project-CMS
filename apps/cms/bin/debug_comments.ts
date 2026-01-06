import 'reflect-metadata'
import { Ignitor, prettyPrintError } from '@adonisjs/core'
import Comment from '#models/comment'

const APP_ROOT = new URL('../', import.meta.url)

const IMPORTER = (filePath: string) => {
    if (filePath.startsWith('./') || filePath.startsWith('../')) {
        return import(new URL(filePath, APP_ROOT).href)
    }
    return import(filePath)
}

async function run() {
    console.log('APP_ROOT:', APP_ROOT.href)
    const ignitor = new Ignitor(APP_ROOT, { importer: IMPORTER })
        .tap((app) => {
            app.booting(async () => {
                await import('#start/env')
            })
        })

    const app = ignitor.createApp('console') // Using console app might be safer or web? 'web' is needed for HTTP context but here strict model access is fine. 'console' is fine for scripts usually.

    await app.init()
    await app.boot()
    await app.start(async () => {
        try {
            console.log('--- DEBUG COMMENT STATUS ---')
            const comments = await Comment.all()
            console.log(`Total Comments: ${comments.length}`)

            for (const c of comments) {
                console.log(`[ID: ${c.id}] Approved: ${c.isApproved} (Type: ${typeof c.isApproved}) - Content: ${c.content.substring(0, 20)}...`)
            }

            const pendingCount = await Comment.query().where('isApproved', false).count('* as total').first()
            // @ts-ignore
            console.log('Pending Count Query Result:', pendingCount?.$extras)
        } catch (e) {
            console.error(e)
        }
    })
}

run().catch((error) => {
    process.exitCode = 1
    prettyPrintError(error)
})
