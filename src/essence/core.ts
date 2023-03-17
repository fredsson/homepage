export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}

export interface ViewModelConfig {
  inputs: {selector: string, change: (ev: any) => void}[],
  bindings: {selector: string, propertyName: string}[]
  events: {selector: string, event: string, callback: () => void}[]
}

export interface ViewModel {
  config(): ViewModelConfig;
  canActivate?(): Promise<boolean>;
  init(): void;
  canDeactivate?(): Promise<boolean>;
  destroy(): void;
}
