(() => {
  type Constructor<T = {}> = new (...args: any[]) => T;

  interface ComposedApp extends RenderingApp {}

  interface RenderingApp {
    components: RenderedComponentMap;
  }

  type RenderedComponentMap = Map<any, RenderingStrategy>;

  type RenderingStrategy = 'eager' | 'lazy';

  const eagerComponent: any = {};
  const lazyComponent: any = {};
  const components: RenderedComponentMap = new Map([
    [eagerComponent, 'eager'],
    [lazyComponent, 'lazy'],
  ]);

  function RenderingDecorator<B extends Constructor<{}>>(
    renderingApp: RenderingApp
  ): (base: B, context: ClassDecoratorContext) => B {
    return (Base: B, context: ClassDecoratorContext) => {
      return context.kind === 'class'
        ? class extends Base {
            components: RenderedComponentMap = renderingApp.components;
          }
        : Base;
    };
  }

  interface AppComponent extends ComposedApp {}
  @RenderingDecorator({
    components,
  })
  class AppComponent {
    property = 'property';

    constructor() {
      console.log('Component');
    }

    method(): string {
      return 'method';
    }
  }

  const component = new AppComponent();

  console.log('C p:::', component.property);
  console.log('C m:::', component.method());
  console.log('C r:::', component.components.get(eagerComponent)); // <---
  console.log('C r:::', component.components.get(lazyComponent)); // <---
})();
