import { Router, ViewModel, ViewModelConfig } from "essence";

export class Nav implements ViewModel {

  constructor(private router: Router) {
  }

  config(): ViewModelConfig {
    return {
      bindings: [],
      events: [
        { selector: '#home-nav-btn', event: 'click', callback: () => this.router.navigate('home')},
        { selector: '#software-nav-btn', event: 'click', callback: () => this.router.navigate('software-dev')},
        { selector: '#gamedev-nav-btn', event: 'click', callback: () => this.router.navigate('game-dev')},
      ],
      inputs: []
    }
  }

  init(): void {
  }

  destroy(): void {
  }
}
