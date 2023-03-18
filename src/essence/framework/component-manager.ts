import { ViewModel } from "essence/core";
import { DependencyInjector } from "./dependency-injection";
import { PlatformService } from "./platform-service";

interface InstantiatedComponent extends ViewModel {
  content: string;
}

const WIREFRAME_CSS_TITLE = 'wireframe_dep';

export class ComponentManager {
  public static inject = [PlatformService, DependencyInjector];

  private activeComponent: InstantiatedComponent | undefined;

  constructor(private platform: PlatformService, private di: DependencyInjector) {
  }

  /**
   * Used from wireframe to load initial component and remove things no longer needed in the wireframe (for example wireframe css)
   */
  public changeToComponent(component: {new(...args: any[]): InstantiatedComponent}) {
    const container = this.platform.querySelector<Element>('#app');
    if (!container) {
      return;
    }

    const instance = this.di.inject(component);

    this.activeComponent?.destroy();
    this.activeComponent = instance;

    this.platform.removeCssStyleWithTitle(WIREFRAME_CSS_TITLE);
    container.innerHTML = instance.content;
    instance.init();
  }

  public changeToComponentFromRoute() {
  }
}
