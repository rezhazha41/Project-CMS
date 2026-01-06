import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class ResetAdminPassword extends BaseCommand {
  static commandName = 'reset:admin-password'
  static description = 'Resets the admin password to "password"'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const user = await User.findBy('email', 'admin@school.com')
    if (!user) {
      this.logger.error('Admin user not found')
      return
    }

    user.password = 'password'
    await user.save()

    this.logger.success('Password reset successfully to "password"')
    this.logger.info(`New Hash: ${user.password}`)

    // verify immediately
    const isValid = await hash.verify(user.password, 'password')
    this.logger.info(`Verification result (user.password): ${isValid}`)

    // Check if it's double hashed
    const singleHash = await hash.make('password')
    const isDoubleHash = await hash.verify(user.password, singleHash)
    this.logger.info(`Is Double Hashed? ${isDoubleHash}`)


    // Isolation test
    const freshHash = await hash.make('password')
    const freshValid = await hash.verify(freshHash, 'password')
    this.logger.info(`Isolation Test (make -> verify): ${freshValid}`)
    this.logger.info(`Fresh Hash: ${freshHash}`)
  }
}