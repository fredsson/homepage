import { ViewModel, ViewModelConfig } from 'essence/core';

export class Work implements ViewModel {
  config(): ViewModelConfig {
    return {
      bindings: [],
      inputs: [],
      events: []
    }
  }
  init(): void {
  }
  destroy(): void {
  }
}