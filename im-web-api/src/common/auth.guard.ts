import { CanActivate, ExecutionContext, HttpStatus, Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { Observable } from "rxjs";
import * as jsonWebToken from 'jsonwebtoken'
import { ConfigService } from "@nestjs/config";
import { ConfigKeys } from "src/config/configuration";
import { UserService } from "src/user/user.service";


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private configService: ConfigService, private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as Request
    const res = context.switchToHttp().getResponse() as Response
    const authToken = req.headers.authorization?.split(' ')[1]

    if(!authToken) {
      res.sendStatus(HttpStatus.BAD_REQUEST)
      return false
    }

    const tokenKey = this.configService.get<string>(ConfigKeys.token) as string
    
    try {
      const { email } = jsonWebToken.verify(authToken, tokenKey) as jsonWebToken.JwtPayload
      const user = await this.userService.getUserByEmail(email)

      if(!user) {
        res.sendStatus(HttpStatus.BAD_REQUEST)
        return false
      }

      req.body.user = { ...user }
      return true

    } catch (err) {
      res.sendStatus(HttpStatus.BAD_REQUEST)
      return false
    }
  }
}