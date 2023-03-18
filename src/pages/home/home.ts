import { Router, ViewModel, ViewModelConfig } from 'essence';

export class Home implements ViewModel {
  constructor(private router: Router) {
  }

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
