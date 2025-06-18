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

import { ActorService } from '@src/actor/actor.service'
import { Auth } from '@src/auth/decorators/auth.decorators'
import { IdValidationPipe } from '@src/pipes/id.validation.pipe'

import { ActorDto } from '@src/actor/dto/actor.dto'

@Controller('actor')
export class ActorController {
  constructor(private readonly ActorService: ActorService) {}

  @Get('by-slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.ActorService.bySlug(slug)
  }

  @Get()
  async getAll(@Query('searchTerm') searchTerm?: string) {
    return this.ActorService.getAll(searchTerm)
  }

  @Get(':id')
  @Auth('admin')
  async get(@Param('id') id: string) {
    return this.ActorService.byId(id)
  }

  @UsePipes(new ValidationPipe())
  @Post()
  @HttpCode(200)
  @Auth('admin')
  async create() {
    return this.ActorService.create()
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  @Auth('admin')
  async updateUser(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: ActorDto
  ) {
    return this.ActorService.update(id, dto)
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth('admin')
  async deleteUser(@Param('id', IdValidationPipe) id: string) {
    return this.ActorService.delete(id)
  }
}
