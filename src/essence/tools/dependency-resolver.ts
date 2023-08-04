import { isDefined } from "essence/core";

/**
 * Can be used to build the needed inject array for dependency injection based on class constructor
 */
export class DependencyResolver {
  public resolveForSource(source: string): string | undefined {
    const startOfConstructor = source.indexOf('constructor');

    const startOfParams = source.indexOf('(', startOfConstructor) + 1;
    const endOfParams = source.indexOf(')', startOfConstructor);
    const params = source.substring(startOfParams, endOfParams);
    if (!params.length) {
      return undefined;
    }

    const types = params.split(',').map(p => p.split(':')[1].trim());
    return `public static inject = [${types}];`;
  }

}
