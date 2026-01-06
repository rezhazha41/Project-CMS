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

    console.log('--- COMMENT LIFECYCLE TEST ---')

    // 1. Create Pending Comment (Guest)
    console.log('1. Creating new pending comment...')
    const comment = await Comment.create({
        postId: 1, // Assumes post 1 exists
        name: 'Test Guest',
        email: 'guest@test.com',
        content: 'Hello World',
        isApproved: false
    })

    console.log(`   Created Comment ID: ${comment.id}, isApproved: ${comment.isApproved}`)

    // 2. Check Pending Count
    const count1 = await getPendingCount()
    console.log(`2. Pending Count (After Create): ${count1}`)

    // 3. Toggle Approval (Simulate Controller)
    console.log('3. Toggling Approval (Approve)...')
    // Refetch to be sure
    const c = await Comment.findOrFail(comment.id)
    c.isApproved = !c.isApproved
    await c.save()
    console.log(`   After Toggle 1 -> isApproved: ${c.isApproved}`)

    // 4. Check Pending Count
    const count2 = await getPendingCount()
    console.log(`4. Pending Count (After Approve): ${count2}`)

    if (count2 < count1) {
        console.log('   SUCCESS: Count decreased as expected.')
    } else {
        console.log('   FAILURE: Count did not decrease!')
    }

    // 5. Toggle Back (Unapprove)
    console.log('5. Toggling Approval Back (Unapprove)...')
    c.isApproved = !c.isApproved
    await c.save()
    console.log(`   After Toggle 2 -> isApproved: ${c.isApproved}`)

    // 6. Check Pending Count
    const count3 = await getPendingCount()
    console.log(`6. Pending Count (After Unapprove): ${count3}`)

    if (count3 > count2) {
        console.log('   SUCCESS: Count increased as expected.')
    } else {
        console.log('   FAILURE: Count did not increase!')
    }

    // Cleanup
    await comment.delete()
}

async function getPendingCount() {
    const result = await Comment.query().where('is_approved', false).count('* as total').first()
    // @ts-ignore
    return Number(result?.$extras.total || 0)
}

run().catch(console.error)
