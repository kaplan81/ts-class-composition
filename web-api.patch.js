"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This is needed to run the code
 * in a Node.js execution context.
 */
if (globalThis.performance.nodeTiming.name === 'node') {
    globalThis.HTMLElement = function hTMLElement() {
        this.tagName = 'custom-tag';
    };
    globalThis.customElements = {
        define: (name, constructor) => void 0,
    };
}
