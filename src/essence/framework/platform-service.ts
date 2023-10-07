
export class PlatformService {
  public querySelector<T extends Element>(selector: string): T | undefined {
    return document.querySelector<T>(selector) ?? undefined;
  }

  public addStyle(styleContent: string): () => void {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = styleContent;

    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }

  public removeAllInlineStyleElements() {
    Array.from(document.head.querySelectorAll('style'))
      .forEach(el => document.head.removeChild(el));
  }
}
