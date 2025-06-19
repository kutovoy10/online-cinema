import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'

import { ActorModel } from '@src/actor/actor.model'
import { ActorService } from '@src/actor/actor.service'
import { ActorController } from '@src/actor/actor.controller'

@Module({
  imports: [
    TypegooseModule.forFeature([
      { typegooseClass: ActorModel, schemaOptions: { collection: 'actors' } },
    ]),
  ],
  controllers: [ActorController],
  providers: [ActorService],
})
export class ActorModule {}
