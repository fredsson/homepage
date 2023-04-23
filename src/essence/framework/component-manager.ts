import { ViewModel } from "essence/core";
import { DependencyInjector } from "./dependency-injection";
import { PlatformService } from "./platform-service";

interface InstantiatedComponent extends ViewModel {
  content: string;
  style?: string;
}

export class ComponentManager {
  public static inject = [PlatformService, DependencyInjector];

  private active: {
    component: InstantiatedComponent | undefined;
    styleRemoveCallback: (() => void) | undefined;
  } = {
    component: undefined,
    styleRemoveCallback: undefined,
  };

  constructor(private platform: PlatformService, private di: DependencyInjector) {
  }

  /**
   * Used from wireframe to load initial component and remove things no longer needed in the wireframe (for example wireframe css)
   */
  public changeToComponent(component: {new(...args: any[]): InstantiatedComponent}): void {
    const container = this.platform.querySelector<Element>('#app');
    if (!container) {
      return;
    }
    this.platform.removeAllInlineStyleElements();

    this.instantiateComponent(component, container);
  }

  /**
   * Used from router to initialise provided route
   */
  public async changeToComponentFromRoute(route: string): Promise<void> {
    const container = this.platform.querySelector<Element>('#app');
    if (!container) {
      return;
    }

    const module = await import(`/${route}/${route}.js`);
    const ctorName = Object.keys(module)[0];
    const ctor = module[ctorName];

    this.instantiateComponent(ctor, container);
  }

  private instantiateComponent(component: {new(...args: any[]): InstantiatedComponent}, container: Element): void {
    const instance = this.di.inject(component);

    this.active.component?.destroy();
    this.active.styleRemoveCallback?.();

    this.active.component = instance;
    this.active.styleRemoveCallback = undefined;

    if (this.active.component.style) {
      this.active.styleRemoveCallback = this.platform.addStyle(this.active.component.style);
    }
    container.innerHTML = instance.content;
    instance.init();
  }
}
