import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Put,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'

import { UserService } from '@src/user/user.service'
import { UpdateUserDto } from '@src/user/dto/update-user.dto'

import { Auth } from '@src/auth/decorators/auth.decorators'
import { User } from '@src/user/decorators/user.decorator'

import { IdValidationPipe } from '@src/pipes/id.validation.pipe'

@Controller('user')
export class UserController {
	constructor(private readonly UserService: UserService) {}

	@Get('profile')
	@Auth()
	async getProfile(@User('_id') _id: string) {
		return this.UserService.byId(_id)
	}

	@UsePipes(new ValidationPipe())
	@Put('update')
	@HttpCode(200)
	@Auth()
	async updateProfile(@User('_id') _id: string, @Body() dto: UpdateUserDto) {
		return this.UserService.update(_id, dto)
	}

	@Get('count')
	@Auth('admin')
	async getCountUsers() {
		return this.UserService.getCount()
	}

	@Get()
	@Auth('admin')
	async getUsers(@Query('searchTerm') searchTerm?: string) {
		return this.UserService.getAll(searchTerm)
	}

	@Get(':id')
	@Auth('admin')
	async getAllUsers(@Param('id', IdValidationPipe) id: string) {
		return this.UserService.byId(id)
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async updateUser(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: UpdateUserDto
	) {
		return this.UserService.update(id, dto)
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth('admin')
	async deleteUser(@Param('id', IdValidationPipe) id: string) {
		return this.UserService.delete(id)
	}
}
