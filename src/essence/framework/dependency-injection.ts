
type InjectionToken<T> = {new(...args: any[]): T};

export class DependencyInjector {
  private existingTokens: Record<string, any> = {};

  public addInstance(token: {name: string}, value: any) {
    if (this.existingTokens.hasOwnProperty(token.name)) {
      throw new Error(`Trying to register ${token.name}, but it already exists in DI`);
    }
    this.existingTokens[token.name] = value;
  }

  public addClass<T>(token: InjectionToken<T> & {inject?: InjectionToken<any>[]}) {
    const deps = (token.inject || []).map(t => this.existingTokens[t.name]);
    this.existingTokens[token.name] = new token(...deps);
  }

  public get<T>(klass: InjectionToken<T> | {name: string}): T | undefined {
    return this.existingTokens[klass.name];
  }
}
