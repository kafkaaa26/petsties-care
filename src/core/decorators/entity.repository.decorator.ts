export function EntityRepository<T>(entity: T | any) {
  return function <T extends { new (...args: any[]): any }>(constructor: T) {
    Reflect.defineMetadata('TYPEORM_REPOSITORY', constructor, entity);
  };
}
