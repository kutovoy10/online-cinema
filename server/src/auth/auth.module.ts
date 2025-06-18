import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { TypegooseModule } from 'nestjs-typegoose'

import { AuthService } from '@src/auth/auth.service'
import { AuthController } from '@src/auth/auth.controller'

import { UserModel } from '@src/user/user.model'
import { getJWTConfig } from '@src/config/jwt.config'
import { JwtStrategy } from '@src/auth/strategies/jwt.strategy'

@Module({
  providers: [AuthService, JwtStrategy],
  imports: [
    TypegooseModule.forFeature([
      { typegooseClass: UserModel, schemaOptions: { collection: 'users' } },
    ]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJWTConfig,
    }),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
