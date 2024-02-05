(() => {
  type Constructor<T = {}> = new (...args: any[]) => T;

  type Rendering = 'eager' | 'lazy';

  interface Composed {
    rendering: Rendering;
  }

  function Decorator<B extends Constructor<{}>>(
    rendering: Rendering
  ): (base: B, context: ClassDecoratorContext) => B {
    return (Base: B, context: ClassDecoratorContext) => {
      return context.kind === 'class'
        ? class extends Base {
            rendering: Rendering = rendering;
          }
        : Base;
    };
  }

  interface AppComponent extends Composed {}
  @Decorator('lazy')
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
  console.log('C r:::', component.rendering); // <---
})();
