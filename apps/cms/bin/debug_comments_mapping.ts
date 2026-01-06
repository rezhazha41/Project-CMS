import 'reflect-metadata'
import { IgnitorFactory } from '@adonisjs/core/factories/http'
import Comment from '#models/comment'

async function run() {
    const ignitor = new IgnitorFactory()
        .withCoreConfig()
        .create(new URL('../', import.meta.url))

    const app = ignitor.createApp('web')
    await app.init()
    await app.boot()

    console.log('--- DEBUG COMMENT QUERY MAPPING ---')

    // Test 1: Using Property Name 'isApproved'
    const countProp = await Comment.query().where('isApproved', false).count('* as total').first()
    // @ts-ignore
    console.log('Query using "isApproved":', Number(countProp?.$extras.total))

    // Test 2: Using Column Name 'is_approved'
    const countCol = await Comment.query().where('is_approved', false).count('* as total').first()
    // @ts-ignore
    console.log('Query using "is_approved":', Number(countCol?.$extras.total))

    // Show all comments status
    const comments = await Comment.all()
    console.log('All Comments Status:')
    comments.forEach(c => {
        console.log(`ID: ${c.id}, isApproved (Prop): ${c.isApproved}, is_approved (Raw): ${c.$extras?.is_approved}`)
    })
}

run().catch(console.error)
