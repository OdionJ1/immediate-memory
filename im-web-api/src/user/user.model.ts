
import * as mongoose from 'mongoose'

export const UserSchema = new mongoose.Schema<User>({
  firstName: { type: 'String', required: true },
  lastName: { type: 'String', required: true },
  email: { type: 'String', required: true },
  passwordHash: { type: 'String', required: true },
  highScore: { type: 'Number', required: true },
  createdAt: { type: 'Date', required: true },
  isGoogleUser: { type: 'Boolean', required: true }
})


export class UserBody {
  firstName: string
  lastName: string
  password: string
  email: string
  isGoogleUser: boolean
}

export class User implements Omit<UserBody, 'password'> {
  userId?: string
  passwordHash: string
  createdAt: Date
  highScore: number
  firstName: string
  lastName: string
  email: string
  isGoogleUser: boolean

  static create = (user: any): User => {
    if(!user) return user;

    const newUser = new User()
    newUser.firstName = user.firstName
    newUser.lastName = user.lastName
    newUser.email = user.email
    newUser.createdAt = user.createdAt
    newUser.userId = user.id ?? user.userId
    newUser.highScore = user.highScore
    newUser.passwordHash = user.passwordHash
    newUser.isGoogleUser = user.isGoogleUser

    return newUser
  }
}

