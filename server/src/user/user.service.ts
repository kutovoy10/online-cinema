import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { genSalt, hash } from 'bcryptjs'

import { UserModel } from '@src/user/user.model'
import { UpdateUserDto } from '@src/user/dto/update-user.dto'

@Injectable()
export class UserService {
  constructor(
    // @ts-ignore
    @InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>
  ) {}

  async byId(_id: string) {
    const user = await this.UserModel.findById(_id)

    if (!user) {
      throw new NotFoundException(`User with id ${_id} not found`)
    }

    return user
  }

  async update(_id: string, dto: UpdateUserDto) {
    const user = await this.byId(_id)
    const isSameUser = await this.UserModel.findOne({ email: dto.email })

    if (isSameUser && String(isSameUser._id) !== _id) {
      throw new NotFoundException(`User with email ${dto.email} already exists`)
    }

    if (dto.password) {
      const salt = await genSalt(10)
      user.password = await hash(dto.password, salt)
    }

    user.email = dto.email

    if (dto.isAdmin || dto.isAdmin === false) {
      user.isAdmin = dto.isAdmin
    }

    await user.save()

    return
  }

  getCount() {
    return this.UserModel.find().countDocuments().exec()
  }

  async getAll(searchTerm?: string) {
    let options = {}

    if (searchTerm) {
      options = {
        $or: [{ email: new RegExp(searchTerm, 'i') }],
      }
    }

    return this.UserModel.find(options)
      .select('-password -updatedAt -__v')
      .sort({ createdAt: 'desc' })
      .exec()
  }

  delete(id: string) {
    return this.UserModel.findByIdAndDelete(id).exec()
  }
}
