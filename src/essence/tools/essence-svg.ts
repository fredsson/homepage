export function registerEssenceSvg() {
  customElements.define("essence-svg", class extends HTMLElement {
    async connectedCallback(src = this.getAttribute("src")!, shadowRoot = this.shadowRoot || this.attachShadow({mode:"open"})) {
      shadowRoot.innerHTML = await (await fetch(src)).text();

      shadowRoot.append(...Array.from(this.querySelectorAll("[shadowRoot]")));

      const element = document.createElement('style');
      element.innerHTML = 'svg { width: inherit; height: inherit}';
      shadowRoot.append(element);
    }
  });
}
