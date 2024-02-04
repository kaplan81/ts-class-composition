(() => {
  function Decorator<T>(target: T, context: ClassDecoratorContext): T {
    console.log('target:::', target);
    console.log('context:::', context);
    return target;
  }

  @Decorator
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
  console.log('C r:::', (c as any).r);
})();
