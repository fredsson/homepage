import { add } from 'common';
import { ViewModel, Router, ViewModelConfig } from 'essence/core';

export class Projects implements ViewModel {

  public constructor(private router: Router) {
  }

  public config(): ViewModelConfig {
    return {
      inputs: [],
      bindings: [],
      events: []
    }
  }

  public init(): void {
    console.log('adding:', add(2,2));
  }

  public destroy(): void {
  }
}