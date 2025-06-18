import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'

import { UserModel } from '@src/user/user.model'
import { UserService } from '@src/user/user.service'
import { UserController } from '@src/user/user.controller'

@Module({
  imports: [
    TypegooseModule.forFeature([
      { typegooseClass: UserModel, schemaOptions: { collection: 'users' } },
    ]),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
