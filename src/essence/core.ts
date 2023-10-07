export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}

export interface ViewModelConfig {
  inputs: {selector: string, change: (ev: any) => void}[],
  bindings: {selector: string, propertyName: string}[]
  events: {selector: string, event: string, callback: (ev: MouseEvent) => void}[]
}

export interface ViewModel<T = any> {
  state?: T
  config(): ViewModelConfig;
  canActivate?(): Promise<boolean>;
  init(): void;
  canDeactivate?(): Promise<boolean>;
  destroy(): void;
}

export abstract class WebComponentViewModel<T = any> extends HTMLElement {
  tagName: string;
  state?: T
  abstract config(): ViewModelConfig;
  canActivate?(): Promise<boolean>;
  abstract init(): void;
  canDeactivate?(): Promise<boolean>;
  abstract destroy(): void;
}
