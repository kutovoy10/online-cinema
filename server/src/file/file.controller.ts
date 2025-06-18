import {
  Controller,
  HttpCode,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

import { FileService } from '@src/file/file.service'
import { Auth } from '@src/auth/decorators/auth.decorators'

@Controller('file')
export class FileController {
  constructor(private readonly FileService: FileService) {}

  @Post()
  @HttpCode(200)
  @Auth('admin')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder: string = 'default'
  ) {
    return this.FileService.saveFiles([file], folder)
  }
}
