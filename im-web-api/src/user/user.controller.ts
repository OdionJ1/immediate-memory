
import { Controller, Post, Get, Res, Req, HttpStatus, UseGuards, Param } from '@nestjs/common';
import { Response, Request } from 'express'
import { UserService } from './user.service';
import { generate, verify } from 'password-hash'
import { User, UserBody } from './user.model';
import { ConfigService } from '@nestjs/config';
import { ConfigKeys } from 'src/config/configuration';
import * as jsonWebToken from 'jsonwebtoken'
import { AuthGuard } from 'src/common/auth.guard';


@Controller('user')
export class UserController {

  constructor (private userService: UserService, private configService: ConfigService) {}

  @Post('signup')
  async createUser (@Req() req: Request, @Res() res: Response) {
    const user = req.body.user as UserBody | null

    if(!user){
      return res.sendStatus(HttpStatus.BAD_REQUEST)
    }

    if(await this.userService.getUserByEmail(user.email)) {
      return res.status(HttpStatus.CONFLICT).json('Account already exists')
    }

    const newUser: User = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      highScore: 0,
      createdAt: new Date(),
      passwordHash: generate(user.password),
      isGoogleUser: false
    }

    await this.userService.createUser(newUser)
    return res.sendStatus(HttpStatus.CREATED)

  }

  @Post('login')
  async login (@Req() req: Request, @Res() res: Response) {
    const email = req.body.email as string | null
    const password = req.body.password as string | null

    if(!email || !password){
      return res.sendStatus(HttpStatus.BAD_REQUEST)
    }

    const existingUser = await this.userService.getUserByEmail(email)

    if(!existingUser){
      return res.sendStatus(HttpStatus.NOT_FOUND)
    }

    const isSame = verify(password, existingUser.passwordHash)

    if(!isSame){
      return res.sendStatus(HttpStatus.NOT_FOUND)
    }
    
    const sessionId = jsonWebToken.sign({ email: existingUser.email }, this.configService.get<string>(ConfigKeys.token) as string, { expiresIn: "7d" })
    return res.status(HttpStatus.OK).json({ user: existingUser, sessionId })
  }

  @Post('googleLogin')
  async googleLogin (@Req() req: Request, @Res() res: Response) {
    const googleUser = req.body.googleUser as UserBody | null
    
    if(!googleUser) return res.status(HttpStatus.BAD_REQUEST)

    const dbUser = await this.userService.getUserByEmail(googleUser.email)

    if(dbUser){
      const sessionId = jsonWebToken.sign({ email: dbUser.email }, this.configService.get<string>(ConfigKeys.token) as string, { expiresIn: "7d" })
      return res.status(HttpStatus.OK).json({ user: dbUser, sessionId })
    } else {
      const newUser: User = {
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
        email: googleUser.email,
        highScore: 0,
        createdAt: new Date(),
        passwordHash: '',
        isGoogleUser: true
      }

      await this.userService.createUser(newUser)
      const sessionId = jsonWebToken.sign({ email: newUser.email }, this.configService.get<string>(ConfigKeys.token) as string, { expiresIn: "7d" })
      return res.status(HttpStatus.OK).json({ user: newUser, sessionId })
    }
  }

  @Get('getUserByToken')
  async getUserByToken (@Req() req: Request, @Res() res: Response) {
    const sessionId = req.headers.authorization?.split(' ')[1]

    if(!sessionId) return res.sendStatus(HttpStatus.BAD_REQUEST)

    jsonWebToken.verify(sessionId, this.configService.get<string>(ConfigKeys.token) as string, async (err, payLoad) => {
      if(err) return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json('An error occured')

      const { email } = payLoad as jsonWebToken.JwtPayload
    
      const user = await this.userService.getUserByEmail(email)
      
      if(!user) return res.sendStatus(HttpStatus.BAD_REQUEST)

      return res.status(HttpStatus.OK).json(User.create(user))
    })
  }

  @Post('update')
  @UseGuards(AuthGuard)
  async updateUser (@Req() req: Request, @Res() res: Response) {
    const user = req.body.user as User
    const userToUpdate = req.body.userToUpdate as User | undefined
    
    if(!userToUpdate) return res.sendStatus(HttpStatus.BAD_REQUEST)

    if(userToUpdate.email === user.email){
      await this.userService.updateUser(userToUpdate)
      return res.sendStatus(HttpStatus.OK)
    }

    return res.sendStatus(HttpStatus.UNAUTHORIZED)
  }

  
}