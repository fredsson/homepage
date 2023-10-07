import { Router, ViewModel, ViewModelConfig } from 'essence';

export class Home implements ViewModel {
  constructor(private router: Router) {
  }

  config(): ViewModelConfig {
    return {
      bindings: [],
      events: [
        { selector: '#software-learn-more', event: 'click', callback: () => this.router.navigate('software-dev')},
        { selector: '#gamedev-learn-more', event: 'click', callback: () => this.router.navigate('game-dev')}
      ],
      inputs: []
    }
  }
  init(): void {
  }
  destroy(): void {
  }
}
