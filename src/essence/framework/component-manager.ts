import { ViewModel } from "essence/core";
import { DependencyInjector } from "./dependency-injection";
import { PlatformService } from "./platform-service";

interface ComponentDefinition {
  new(...args: any[]): InstantiatedComponent;
  webComponents: string[];
  inject?: any[];
}

interface InstantiatedComponent extends ViewModel {
  content: string;
  style?: string;
  webComponents: string[];
}

export class ComponentManager {
  public static inject = [PlatformService, DependencyInjector];

  private loadedWebComponents: string[] = [];

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
  public changeToComponent(component: ComponentDefinition): void {
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
  public async changeToComponentFromRoute(route: string): Promise<boolean> {
    const container = this.platform.querySelector<Element>('#app');
    if (!container) {
      return false;
    }

    const importRoute = route.includes('home') ? `/${route}.js` : `/${route}/${route}.js`;

    const module = await import(importRoute);
    const ctorName = Object.keys(module)[0];
    const ctor = module[ctorName];

    this.instantiateComponent(ctor, container);

    return true;
  }

  private instantiateComponent(component: ComponentDefinition, container: Element): void {
    this.loadWebComponents(component);

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

  private loadWebComponents(component: ComponentDefinition) {
    component.webComponents.forEach(async (componentName) => {
      if (this.loadedWebComponents.includes(componentName)) {
        return;
      }

      const module = await import(`/${componentName}/${componentName}.js`);
      const ctorName = Object.keys(module)[0];
      const ctor = module[ctorName];
      this.di.injectWebComponent(ctor, module);

      this.loadedWebComponents.push(componentName);
    });
  }
}
