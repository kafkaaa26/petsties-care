import { DynamicModule, Provider } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export class TypeOrmCustomModule {
  public static forFeature<T extends new (...args: any[]) => any>(
    entities: T[],
  ): DynamicModule {
    const providers: Provider[] = [];
    for (const item of entities) {
      const repository = Reflect.getMetadata('TYPEORM_REPOSITORY', item);

      if (!repository) {
        continue;
      }

      providers.push({
        inject: [getDataSourceToken()],
        provide: repository,
        useFactory: (dataSource: DataSource) => {
          const baseRepository = dataSource.getRepository(item);
          return new repository(
            baseRepository.target,
            baseRepository.manager,
            baseRepository.queryRunner,
          );
        },
      });
    }

    return {
      exports: providers,
      module: TypeOrmCustomModule,
      providers,
    };
  }
}
