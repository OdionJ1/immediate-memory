import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UserSchema } from './user.model'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { ConfigModule } from '@nestjs/config'
import configuration from 'src/config/configuration'


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'user', schema: UserSchema }
    ]),
    ConfigModule.forFeature(configuration)
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}