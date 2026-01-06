
import 'reflect-metadata'
import { IgnitorFactory } from '@adonisjs/core/factories'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

async function run() {
    const ignitor = new IgnitorFactory()
        .withCoreConfig()
        .create(new URL('../', import.meta.url))

    const app = ignitor.createApp('web')
    await app.init()
    await app.boot()

    const user = await User.findBy('email', 'admin@school.com')

    if (!user) {
        console.log('User not found!')
        return
    }

    console.log('User found:', user.email)
    console.log('Stored Hash:', user.password)

    const isValid = await hash.verify(user.password, 'password')
    console.log('Password "password" is valid:', isValid)
}

run()
