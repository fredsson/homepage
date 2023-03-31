import { ComponentManager } from "./component-manager";

export class Router {
  public static inject = [ComponentManager];

  constructor(private componentManager: ComponentManager) {
  }

  public navigate(route: string): void {
    // stop routing
    // change to component
    this.componentManager.changeToComponentFromRoute(route);
    // if component loaded ok
    //   update route
  }
}
