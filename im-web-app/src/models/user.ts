

export class User {
  userId: string
  firstName: string
  lastName: string
  email: string
  highScore: number
  isGoogleUser: boolean

  static create = (user: any): User => {
    if(!user) return user

    const newUser = new User()
    newUser.userId = ''
    newUser.firstName = user.firstName
    newUser.lastName = user.lastName
    newUser.email = user.email
    newUser.highScore = user.highScore
    newUser.isGoogleUser = user.isGoogleUser

    return newUser
  }
}