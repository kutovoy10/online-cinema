import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'

import { GenreService } from '@src/genre/genre.service'
import { CreateGenreDto } from '@src/genre/dto/create-genre.dto'
import { Auth } from '@src/auth/decorators/auth.decorators'
import { IdValidationPipe } from '@src/pipes/id.validation.pipe'

@Controller('genre')
export class GenreController {
  constructor(private readonly GenreService: GenreService) {}

  @Get('by-slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.GenreService.bySlug(slug)
  }

  @Get('/collection')
  async getCollection() {
    return this.GenreService.getCollection()
  }

  @Get()
  async getAll(@Query('searchTerm') searchTerm?: string) {
    return this.GenreService.getAll(searchTerm)
  }

  @Get(':id')
  @Auth('admin')
  async get(@Param('id') id: string) {
    return this.GenreService.byId(id)
  }

  @UsePipes(new ValidationPipe())
  @Post()
  @HttpCode(200)
  @Auth('admin')
  async create() {
    return this.GenreService.create()
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  @Auth('admin')
  async updateUser(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: CreateGenreDto
  ) {
    return this.GenreService.update(id, dto)
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth('admin')
  async deleteUser(@Param('id', IdValidationPipe) id: string) {
    return this.GenreService.delete(id)
  }
}
