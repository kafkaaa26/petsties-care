import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './config/db.config';
import { TypeOrmCustomModule } from './typeorm-custom.module';
import * as entities from '@entities/index';

const entitiesArray = Object.values(entities);

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({ ...dbConfig, entities: entitiesArray }),
    TypeOrmCustomModule.forFeature(entitiesArray),
  ],
  exports: [TypeOrmModule, TypeOrmCustomModule],
})
export class CoreModule {}
