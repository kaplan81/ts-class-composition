import '../web-api.patch.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T = {}> = new (...args: any[]) => T;

interface Composed {
  menuOpen: boolean;
  state: State;
  toggleMenu(): void;
}

interface State {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  entity: any | null;
  loaded: boolean;
  loading: boolean;
}

const initialState: State = {
  entity: null,
  loaded: false,
  loading: false,
};

function CustomElementDecorator<T extends Constructor<HTMLElement>>(
  tagName: string
): (target: T, context: ClassDecoratorContext) => T {
  return (target: T, context: ClassDecoratorContext) => {
    context.addInitializer(() => {
      customElements.define(tagName, target);
    });
    return target;
  };
}

// eslint-disable-next-line @typescript-eslint/ban-types
function StateDecorator<T extends Constructor<{}>>(
  initialState: State
): (target: T, context: ClassDecoratorContext) => T {
  return (target: T, context: ClassDecoratorContext) => {
    console.log('StateDecorator');
    return context.kind === 'class'
      ? class extends target {
          state: State = initialState;
        }
      : target;
  };
}

// eslint-disable-next-line @typescript-eslint/ban-types
function MenuDecorator<T extends Constructor<{}>>(): (
  target: T,
  context: ClassDecoratorContext
) => T {
  return (target: T, context: ClassDecoratorContext) => {
    console.log('MenuDecorator');
    return context.kind === 'class'
      ? class extends target {
          menuOpen: boolean = false;
          toggleMenu(): void {
            this.menuOpen = !this.menuOpen;
          }
        }
      : target;
  };
}

interface Component extends Composed {}
@CustomElementDecorator('custom-tag')
@StateDecorator(initialState)
@MenuDecorator()
class Component extends HTMLElement {
  property = 'property';

  constructor() {
    super();
    console.log('Component');
  }

  method(): string {
    return 'method';
  }
}

const component = new Component();
console.log('component.state:::', component.state);
console.log('component.tagName:::', component.tagName);
console.log('component.menuOpen:::', component.menuOpen);
component.toggleMenu();
console.log('component.menuOpen:::', component.menuOpen);
