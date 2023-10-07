
type InjectionToken<T> = {
  new(...args: any[]): T;
  inject?: InjectionToken<any>[];
}

export class DependencyInjector {
  private existingTokens: Record<string, any> = {};

  constructor() {
    this.existingTokens[DependencyInjector.name] = this;
  }

  public addInstance(token: {name: string}, value: any) {
    if (this.existingTokens.hasOwnProperty(token.name)) {
      throw new Error(`Trying to register ${token.name}, but it already exists in DI`);
    }
    this.existingTokens[token.name] = value;
  }

  public addClass<T>(token: InjectionToken<T>) {
    const deps = (token.inject || []).map(t => this.existingTokens[t.name]);
    this.existingTokens[token.name] = new token(...deps);
  }

  public get<T>(klass: InjectionToken<T> | {name: string}): T | undefined {
    return this.existingTokens[klass.name];
  }

  /**
   * instantiate and return the provided token, providing defined dependencies.
   *
   * The provided token and instance is not saved inside the DI
   */
  public inject<T>(token: InjectionToken<T>): T {
    const deps = (token.inject || []).map(t => this.get(t));
    return new token(...deps);
  }

  public injectWebComponent<T>(token: InjectionToken<T> & {init: (...args: any[]) => void}): void {
    const deps = (token.inject || []).map(t => this.get(t));

    token.init(deps);
  }
}
