import { Router, ViewModel, ViewModelConfig } from 'essence';

export class Home implements ViewModel {
  constructor(private router: Router) {
  }

  config(): ViewModelConfig {
    return {
      bindings: [],
      events: [
        { selector: '#projects-link', event: 'click', callback: () => this.router.navigate('projects')}
      ],
      inputs: []
    }
  }
  init(): void {
  }
  destroy(): void {
  }
}
