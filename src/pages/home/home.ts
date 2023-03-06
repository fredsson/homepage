import { ViewModel, ViewModelConfig } from 'essence/core';

export class Home implements ViewModel {
  config(): ViewModelConfig {
    return {
      bindings: [],
      events: [],
      inputs: []
    }
  }
  init(): void {
  }
  destroy(): void {
  }
}