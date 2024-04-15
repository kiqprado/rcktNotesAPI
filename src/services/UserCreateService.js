const { hash } = require('bcryptjs')
const AppError = require('../utils/AppError')

class UserCreateService {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async execute({ name, email, password }) {
    const checkUsersExist = await this.userRepository.findByEmail(email)

    if (checkUsersExist) {
      throw new AppError('Este e-mail já está em uso.')
    }

    const hashedPassword = await hash(password, 8)

    const userCrated = await this.userRepository.create({
      name,
      email,
      password: hashedPassword
    })

    return userCrated
  }
}

module.exports = UserCreateService
