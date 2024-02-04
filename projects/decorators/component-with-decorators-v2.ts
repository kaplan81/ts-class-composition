(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type Constructor<T = {}> = new (...args: any[]) => T;

  type Rendering = 'eager' | 'lazy';

  interface Composed {
    r: Rendering;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  function Decorator<T extends Constructor<{}>>(
    rendering: Rendering
  ): (target: T, context: ClassDecoratorContext) => T {
    return (target: T, context: ClassDecoratorContext) => {
      return context.kind === 'class'
        ? class extends target {
            r: Rendering = rendering;
          }
        : target;
    };
  }

  interface C extends Composed {}
  @Decorator('lazy')
  class C {
    p = 'property';

    constructor() {
      console.log('constructor');
    }

    m(): string {
      return 'method';
    }
  }

  const c = new C();

  console.log('C p:::', c.p);
  console.log('C m:::', c.m());
  console.log('C r:::', c.r);
})();
