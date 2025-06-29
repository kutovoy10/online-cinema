import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypegooseModule } from 'nestjs-typegoose'

import { AppService } from '@src/app.service'
import { AppController } from '@src/app.controller'

import { AuthModule } from '@src/auth/auth.module'
import { UserModule } from '@src/user/user.module'
import { GenreModule } from '@src/genre/genre.module'
import { FileModule } from '@src/file/file.module'
import { ActorModule } from '@src/actor/actor.module'

import { getMongoDbConfig } from '@src/config/mongo.config'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoDbConfig,
    }),
    AuthModule,
    UserModule,
    GenreModule,
    FileModule,
    ActorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
