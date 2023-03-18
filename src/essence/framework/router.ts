import { ComponentManager } from "./component-manager";

export class Router {
  public static inject = [ComponentManager];

  constructor(componentManager: ComponentManager) {
  }
}
