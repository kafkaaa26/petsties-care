import { logger } from '../models/logger';

export function Logger() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): void {
    const functionName = `${target.constructor.name}.${propertyKey}`;
    const targetMethod = descriptor.value;

    if (typeof targetMethod !== 'function') return;

    const returnType = Reflect.getMetadata(
      'design:returntype',
      target,
      propertyKey,
    );

    if (returnType?.name == 'Promise') {
      descriptor.value = async function (...args: any[]) {
        logger.log(functionName, 'Start');
        // logger.log(args, 'Input');
        const result = await targetMethod.apply(this, args);
        // logger.log(result, 'Output');
        logger.log(functionName, 'End');
        return result;
      };
    } else {
      descriptor.value = function (...args: any[]) {
        logger.log(functionName, 'Start');
        // logger.log(args, 'Input');
        const result = targetMethod.apply(this, args);
        // logger.log(result, 'Output');
        logger.log(functionName, 'End');
        return result;
      };
    }
  };
}
