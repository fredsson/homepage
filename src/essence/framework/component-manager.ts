import { ViewModel } from "essence/core";
import { DependencyInjector } from "./dependency-injection";
import { PlatformService } from "./platform-service";

interface InstantiatedComponent extends ViewModel {
  content: string;
}

export class ComponentManager {
  public static inject = [PlatformService, DependencyInjector];

  private activeComponent: InstantiatedComponent | undefined;

  constructor(private platform: PlatformService, private di: DependencyInjector) {
  }

  public changeToComponent(component: {new(...args: any[]): InstantiatedComponent}) {
    const container = this.platform.querySelector<Element>('#app');
    if (!container) {
      return;
    }

    const instance = this.di.inject(component);

    this.activeComponent?.destroy();
    this.activeComponent = instance;

    container.innerHTML = instance.content;
    instance.init();
  }
}
