import { Router, ViewModel, ViewModelConfig } from "essence";

export class SoftwareDev implements ViewModel {
  constructor(private router: Router) {
  }

  config(): ViewModelConfig {
    return {
      inputs: [],
      events: [
        { selector: '#home-nav-btn', event: 'click', callback: () => this.router.navigate('home')},
        { selector: '#software-nav-btn', event: 'click', callback: () => this.router.navigate('software-dev')},
        { selector: '#gamedev-nav-btn', event: 'click', callback: () => this.router.navigate('game-dev')},
      ],
      bindings: []
    };
  }

  init(): void {
  }

  destroy(): void {
  }
}
