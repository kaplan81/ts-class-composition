(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type Constructor<T = {}> = new (...args: any[]) => T;

  type Rendering = 'eager' | 'lazy';

  interface Composed {
    r: Rendering;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  function Decorator<B extends Constructor<{}>>(
    rendering: Rendering
  ): (base: B, ctx: ClassDecoratorContext) => B {
    return (Base: B, context: ClassDecoratorContext) => {
      return context.kind === 'class'
        ? class extends Base {
            r: Rendering = rendering;
          }
        : Base;
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
