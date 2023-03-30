import { ComponentManager } from "./component-manager";

export class Router {
  public static inject = [ComponentManager];

  constructor(private componentManager: ComponentManager) {
  }

  public navigate(route: string): void {
  constructor(componentManager: ComponentManager) {
  }
}
