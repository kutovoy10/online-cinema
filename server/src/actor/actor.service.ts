import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from '@typegoose/typegoose/lib/types'

import { ActorModel } from '@src/actor/actor.model'

import { ActorDto } from '@src/actor/dto/actor.dto'

@Injectable()
export class ActorService {
  constructor(
    // @ts-ignore
    @InjectModel(ActorModel) private readonly ActorModel: ModelType<ActorModel>
  ) {}

  async bySlug(slug: string) {
    const doc = await this.ActorModel.findOne({ slug }).exec()

    if (!doc) {
      throw new NotFoundException(`Actor with slug ${slug} not found`)
    }

    return doc
  }

  async getAll(searchTerm?: string) {
    let options = {}

    if (searchTerm) {
      options = {
        $or: [
          { name: new RegExp(searchTerm, 'i') },
          { slug: new RegExp(searchTerm, 'i') },
        ],
      }
    }

    return this.ActorModel.aggregate()
      .match(options)
      .lookup({
        from: 'movies',
        localField: '_id',
        foreignField: 'actors',
        as: 'movies',
      })
      .addFields({ countMovies: { $size: '$movies' } })
      .project({ __v: 0, updatedAt: 0, movies: 0 })
      .sort({ createdAt: -1 })
      .exec()
  }

  /* Admin */

  async byId(_id: string) {
    const actor = await this.ActorModel.findById(_id)

    if (!actor) {
      throw new NotFoundException(`Actor with id ${_id} not found`)
    }

    return actor
  }

  async create() {
    const defaultValue: ActorDto = {
      name: '',
      slug: '',
      photo: '',
    }

    const actor = await this.ActorModel.create(defaultValue)

    return actor._id
  }

  update(_id: string, dto: ActorDto) {
    const updateDoc = this.ActorModel.findByIdAndUpdate(_id, dto, {
      new: true,
    }).exec()

    if (!updateDoc) {
      throw new NotFoundException(`Actor with id ${_id} not found`)
    }

    return updateDoc
  }

  delete(id: string) {
    const deleteDoc = this.ActorModel.findByIdAndDelete(id).exec()

    if (!deleteDoc) {
      throw new NotFoundException(`Actor with id ${id} not found`)
    }

    return deleteDoc
  }
}
