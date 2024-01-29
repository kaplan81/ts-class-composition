import {
  BehaviorSubject,
  MonoTypeOperatorFunction,
  Observable,
  shareReplay,
} from 'rxjs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T = {}> = new (...args: any[]) => T;

interface Composed extends State<EntityExample> {
  menuOpen: boolean;
  toggleMenu(): void;
}

interface State<E> extends NgrxEntityState<E> {
  loaded: boolean;
  loading: boolean;
}

interface NgrxEntityState<E> {
  ids: string[] | number[];
  entities: { [id: string | number]: E };
}

interface EntityExample {
  id: string | number;
  entity: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
  };
}

interface StateMixinFacade<S> {
  state$: Observable<S>;
  resetState(): void;
  updateState(state: S): void;
}

const emptyBase: Constructor = class {};

const initialState: State<EntityExample> = {
  ids: [1],
  entities: {
    [1]: {
      id: 1,
      entity: {
        data: {},
      },
    },
  },
  loaded: false,
  loading: false,
};

function shareReplayForMulticast<T>(): MonoTypeOperatorFunction<T> {
  return shareReplay({ bufferSize: 1, refCount: true });
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function StateMixin<T extends Constructor<{}>>(
  Base: T,
  initialState: State<EntityExample>
): Constructor<StateMixinFacade<State<EntityExample>>> & T {
  return class extends Base {
    #dispatch$: BehaviorSubject<State<EntityExample>>;
    #initialState: State<EntityExample> = initialState;
    state$: Observable<State<EntityExample>>;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args);
      this.#dispatch$ = new BehaviorSubject<State<EntityExample>>(
        this.#initialState
      );
      this.state$ = this.#dispatch$
        .asObservable()
        .pipe(shareReplayForMulticast());
    }

    resetState(): void {
      this.#dispatch$.next(this.#initialState);
    }

    updateState(state: State<EntityExample>): void {
      this.#dispatch$.next(state);
    }
  };
}

// // eslint-disable-next-line @typescript-eslint/ban-types
// function MenuDecorator<T extends Constructor<{}>>(): (
//   target: T,
//   context: ClassDecoratorContext
// ) => T {
//   return (target: T, context: ClassDecoratorContext) => {
//     console.log('MenuDecorator');
//     return context.kind === 'class'
//       ? class extends target {
//           menuOpen: boolean = false;
//           toggleMenu(): void {
//             this.menuOpen = !this.menuOpen;
//           }
//         }
//       : target;
//   };
// }

interface Component extends Composed {}
// @CustomElementDecorator('custom-tag')
// @StateDecorator(initialState)
// @MenuDecorator()
// class Component extends HTMLElement {
class Component extends StateMixin(emptyBase, initialState) {
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
// console.log('component.state:::', component.state);
// console.log('component.tagName:::', component.tagName);
// console.log('component.menuOpen:::', component.menuOpen);
// component.toggleMenu();
// console.log('component.menuOpen:::', component.menuOpen);
