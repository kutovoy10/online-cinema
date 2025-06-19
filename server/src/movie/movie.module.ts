import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'

import { MovieModel } from '@src/movie/movie.model'
import { MovieService } from '@src/movie/movie.service'
import { MovieController } from '@src/movie/movie.controller'

@Module({
  imports: [
    TypegooseModule.forFeature([
      { typegooseClass: MovieModel, schemaOptions: { collection: 'movies' } },
    ]),
  ],
  providers: [MovieService],
  controllers: [MovieController],
})
export class MovieModule {}
