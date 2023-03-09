
export class PlatformService {
  public querySelector<T extends Element>(selector: string): T | undefined {
    return document.querySelector<T>(selector) ?? undefined;
  }

}
