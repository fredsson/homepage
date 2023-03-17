
export class PlatformService {
  public querySelector<T extends Element>(selector: string): T | undefined {
    return document.querySelector<T>(selector) ?? undefined;
  }

  public removeCssStyleWithTitle(title: string): void {
    const styleTag = document.head.querySelector(`[title='${title}']`);
    if (styleTag) {
      document.head.removeChild(styleTag);
    }
  }
}
