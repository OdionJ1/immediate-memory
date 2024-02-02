
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';


@Injectable()
export class UserService  {
  
  constructor(@InjectModel('user') private readonly userModel: Model<User>){}

  createUser = async (newUser: User): Promise<void> => {
    const newUserModel = new this.userModel({ ...newUser })
    await newUserModel.save()
  }

  getUserByEmail = async (email: string ) => {
    const user = await this.userModel.findOne({ email })

    if(user){
      return User.create(user)
    }

    return null
  }

  updateUser = async (user: User) => {
    const updatedUser = await this.userModel.findOne({ email: user.email })
    if(updatedUser) {
      updatedUser.firstName = user.firstName
      updatedUser.lastName = user.lastName
      updatedUser.highScore = user.highScore
      
      await updatedUser.save()
    }
  }
}