import { ComponentManager } from "./component-manager";

export class Router {
  public static inject = [ComponentManager];

  constructor(private componentManager: ComponentManager) {
    window.addEventListener('popstate', (event) => {
      const route = (event.state && event.state.route) ?? 'home';
      this.navigateToComponent(route);
    });
  }

  public async navigate(route: string): Promise<void> {
    const loaded = await this.navigateToComponent(route);

    if (loaded) {
      const shownRoute = route === 'home' ? '/' : route;
      history.pushState({route}, '', shownRoute);
    }
  }

  private async navigateToComponent(route: string): Promise<boolean> {
    return await this.componentManager.changeToComponentFromRoute(route);
  }
}
