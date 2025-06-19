import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from '@typegoose/typegoose/lib/types'

import { MovieModel } from '@src/movie/movie.model'
import { UpdateMovieDto } from '@src/movie/dto/update-movie-dto'
import { Types } from 'mongoose'

@Injectable()
export class MovieService {
  constructor(
    // @ts-ignore
    @InjectModel(MovieModel) private readonly MovieModel: ModelType<MovieModel>
  ) {}

  async getAll(searchTerm?: string) {
    let options = {}

    if (searchTerm) {
      options = {
        $or: [{ title: new RegExp(searchTerm, 'i') }],
      }
    }

    // Aggregation

    return this.MovieModel.find(options)
      .select('-updatedAt -__v')
      .sort({ createdAt: 'desc' })
      .populate('actors genres')
      .exec()
  }

  async bySlug(slug: string) {
    const doc = await this.MovieModel.findOne({ slug })
      .populate('actors genres')
      .exec()

    if (!doc) {
      throw new NotFoundException(`Movie with slug ${slug} not found`)
    }

    return doc
  }

  async byActor(actorId: Types.ObjectId) {
    const docs = await this.MovieModel.findOne({ actor: actorId }).exec()

    if (!docs) {
      throw new NotFoundException(`Movie with actor id ${actorId} not found`)
    }

    return docs
  }

  async byGenres(genreIds: Types.ObjectId[]) {
    const docs = await this.MovieModel.find({
      genres: { $in: genreIds },
    }).exec()

    if (!docs) {
      throw new NotFoundException(`Movies with genre ids ${genreIds} not found`)
    }

    return docs
  }

  async getMostPopular() {
    return await this.MovieModel.find({ countOpened: { $gt: 0 } })
      .sort({ countOpened: -1 })
      .populate('actors genres')
      .exec()
  }

  updateCountOpened(slug: string) {
    const updateDoc = this.MovieModel.findOneAndUpdate(
      { slug },
      { $inc: { countOpened: 1 } },
      { new: true }
    ).exec()

    if (!updateDoc) {
      throw new NotFoundException(`Movie with slug ${slug} not found`)
    }

    return updateDoc
  }

  /* Admin */

  async byId(_id: string) {
    const movie = await this.MovieModel.findById(_id)

    if (!movie) {
      throw new NotFoundException(`Movie with id ${_id} not found`)
    }

    return movie
  }

  async create() {
    const defaultValue: UpdateMovieDto = {
      bigPoster: '',
      actors: [],
      genres: [],
      title: '',
      slug: '',
      poster: '',
      videoUrl: '',
    }

    const movie = await this.MovieModel.create(defaultValue)

    return movie._id
  }

  update(_id: string, dto: UpdateMovieDto) {
    /* Telegram notification */

    const updateDoc = this.MovieModel.findByIdAndUpdate(_id, dto, {
      new: true,
    }).exec()

    if (!updateDoc) {
      throw new NotFoundException(`Movie with id ${_id} not found`)
    }

    return updateDoc
  }

  delete(id: string) {
    const deleteDoc = this.MovieModel.findByIdAndDelete(id).exec()

    if (!deleteDoc) {
      throw new NotFoundException(`Movie with id ${id} not found`)
    }

    return deleteDoc
  }
}
