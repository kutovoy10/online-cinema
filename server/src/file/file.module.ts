import { Module } from '@nestjs/common'
import { path } from 'app-root-path'

import { FileService } from '@src/file/file.service'
import { FileController } from '@src/file/file.controller'
import { ServeStaticModule } from '@nestjs/serve-static'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: `${path}/uploads`,
      serveRoot: '/uploads',
    }),
  ],
  providers: [FileService],
  controllers: [FileController],
})
export class FileModule {}
