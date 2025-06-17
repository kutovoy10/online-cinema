import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from '@typegoose/typegoose/lib/types'

import { GenreModel } from '@src/genre/genre.model'
import { CreateGenreDto } from '@src/genre/dto/create-genre.dto'

@Injectable()
export class GenreService {
	constructor(
		// @ts-ignore
		@InjectModel(GenreModel) private readonly GenreModel: ModelType<GenreModel>
	) {}

	bySlug(slug: string) {
		return this.GenreModel.findOne({ slug }).exec()
	}

	async getAll(searchTerm?: string) {
		let options = {}

		if (searchTerm) {
			options = {
				$or: [
					{ name: new RegExp(searchTerm, 'i') },
					{ slug: new RegExp(searchTerm, 'i') },
					{ description: new RegExp(searchTerm, 'i') },
				],
			}
		}

		return this.GenreModel.find(options)
			.select('-updatedAt -__v')
			.sort({ createdAt: 'desc' })
			.exec()
	}

	async getCollection() {
		const genres = await this.getAll()
		const collection = genres // will add a code later
		return collection
	}

	/* Admin */

	async byId(_id: string) {
		const genre = await this.GenreModel.findById(_id)

		if (!genre) {
			throw new NotFoundException(`Genre with id ${_id} not found`)
		}

		return genre
	}

	async create() {
		const defaultValue: CreateGenreDto = {
			name: '',
			slug: '',
			description: '',
			icon: '',
		}

		const genre = await this.GenreModel.create(defaultValue)

		return genre._id
	}

	update(_id: string, dto: CreateGenreDto) {
		const updateDoc = this.GenreModel.findByIdAndUpdate(_id, dto, {
			new: true,
		}).exec()

		if (!updateDoc) {
			throw new NotFoundException(`Genre with id ${_id} not found`)
		}

		return updateDoc
	}

	delete(id: string) {
		const deleteDoc = this.GenreModel.findByIdAndDelete(id).exec()

		if (!deleteDoc) {
			throw new NotFoundException(`Genre with id ${id} not found`)
		}

		return deleteDoc
	}
}
