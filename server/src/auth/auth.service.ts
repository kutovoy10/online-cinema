import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { hash, genSalt, compare } from 'bcryptjs'

import { UserModel } from '@src/user/user.model'
import { AuthDto } from '@src/auth/dto/auth.dto'
import { RefreshTokenDto } from '@src/auth/dto/refreshToken.dto'

@Injectable()
export class AuthService {
	constructor(
		// @ts-ignore
		@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
		private readonly jwtService: JwtService
	) {}

	async login(dto: AuthDto) {
		const user = await this.validateUser(dto)

		const tokens = await this.issueTokenPair(String(user._id))

		return {
			user: this.returnUserFields(user),
			...tokens,
		}
	}

	async getNewTokens({ refreshToken }: RefreshTokenDto) {
		if (!refreshToken) {
			throw new UnauthorizedException('Refresh token is required')
		}

		const result = await this.jwtService.verifyAsync(refreshToken)
		if (!result) {
			throw new UnauthorizedException('Invalid refresh token')
		}

		const user = await this.UserModel.findById(result._id)
		if (!user) {
			throw new UnauthorizedException('User not found')
		}

		const tokens = await this.issueTokenPair(String(user._id))

		return {
			user: this.returnUserFields(user),
			...tokens,
		}
	}

	async register(dto: AuthDto) {
		const oldUser = await this.UserModel.findOne({ email: dto.email })

		if (oldUser) {
			throw new BadRequestException('User with this email already exists')
		}

		const salt = await genSalt(10)

		const newUser = new this.UserModel({
			email: dto.email,
			password: await hash(dto.password, salt),
		})

		const tokens = await this.issueTokenPair(String(newUser._id))

		await newUser.save()

		return {
			user: this.returnUserFields(newUser),
			...tokens,
		}
	}

	async validateUser(dto: AuthDto): Promise<UserModel> {
		const user = await this.UserModel.findOne({ email: dto.email })

		if (!user) {
			throw new UnauthorizedException('User not found')
		}

		const isValid = await compare(dto.password, user.password)

		if (!isValid) {
			throw new UnauthorizedException('Invalid password')
		}

		return user
	}

	async issueTokenPair(userId: string) {
		const data = { _id: userId }

		const refreshToken = await this.jwtService.signAsync(data, {
			expiresIn: '15d',
		})

		const accessToken = await this.jwtService.signAsync(data, {
			expiresIn: '15m',
		})

		return { refreshToken, accessToken }
	}

	returnUserFields(user: UserModel) {
		return {
			_id: user._id,
			email: user.email,
			isAdmin: user.isAdmin,
		}
	}
}
