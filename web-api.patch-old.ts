/**
 * This is needed to run the code
 * in a Node.js execution context.
 *
 * We don't do that anymore, since we serve an index.html file.
 */
if ((globalThis as any).performance.nodeTiming.name === 'node') {
  (globalThis as any).HTMLElement = function hTMLElement() {
    this.tagName = 'custom-tag';
  };
  (globalThis as any).customElements = {
    define: (name: string, constructor: CustomElementConstructor) => void 0,
  };
}
