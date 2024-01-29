import {
  BehaviorSubject,
  MonoTypeOperatorFunction,
  Observable,
  shareReplay,
} from 'rxjs';

/**
 * This is needed to run the code
 * in a Node.js execution context.
 */
if ((globalThis as any).performance.nodeTiming.name === 'node') {
  (globalThis as any).HTMLElement = function hTMLElement() {
    this.tagName = 'custom-tag';
  };
  (globalThis as any).customElements = {
    define: (name: string, constructor: CustomElementConstructor) => void 0,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T = {}> = new (...args: any[]) => T;

interface Menu {
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

// eslint-disable-next-line @typescript-eslint/ban-types
export function MenuMixin<T extends Constructor<{}>>(
  Base: T
): Constructor<Menu> & T {
  return class extends Base {
    menuOpen: boolean = false;
    toggleMenu(): void {
      this.menuOpen = !this.menuOpen;
    }
  };
}

class Component extends StateMixin(MenuMixin(HTMLElement), initialState) {
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
console.log(component);
// console.log('component.state:::', component.state);
// console.log('component.tagName:::', component.tagName);
// console.log('component.menuOpen:::', component.menuOpen);
// component.toggleMenu();
// console.log('component.menuOpen:::', component.menuOpen);
