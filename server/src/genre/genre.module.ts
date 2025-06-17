import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'

import { GenreModel } from '@src/genre/genre.model'
import { GenreService } from '@src/genre/genre.service'
import { GenreController } from '@src/genre/genre.controller'

@Module({
	imports: [
		TypegooseModule.forFeature([
			{ typegooseClass: GenreModel, schemaOptions: { collection: 'genres' } },
		]),
	],
	controllers: [GenreController],
	providers: [GenreService],
})
export class GenreModule {}
