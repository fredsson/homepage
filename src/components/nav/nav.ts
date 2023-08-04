import { ComponentViewModel, Router, ViewModelConfig } from "essence";

export class Nav implements ComponentViewModel {
  public tagName = 'app-nav';

  constructor(private router: Router) {
  }

  config(): ViewModelConfig {
    return {
      bindings: [],
      events: [
        { selector: '#home-nav-btn', event: 'click', callback: () => this.router.navigate('home')},
        { selector: '#software-nav-btn', event: 'click', callback: () => this.router.navigate('software-dev')},
        { selector: '#gamedev-nav-btn', event: 'click', callback: () => this.router.navigate('game-dev')},
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
