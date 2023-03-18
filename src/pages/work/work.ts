import { add } from 'common';
import { ViewModel, ViewModelConfig } from 'essence';

export class Work implements ViewModel {
  constructor() {
  }

  config(): ViewModelConfig {
    return {
      bindings: [],
      inputs: [],
      events: []
    }
  }
  init(): void {
    console.log(add(5,5));
  }
  destroy(): void {
  }
}
