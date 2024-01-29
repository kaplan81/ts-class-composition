import '../web-api.patch.js';
import {
  BehaviorSubject,
  MonoTypeOperatorFunction,
  Observable,
  shareReplay,
} from 'rxjs';

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

export function CustomElementMixin<T extends Constructor<HTMLElement>>(
  target: T,
  tagName: string
): Constructor<HTMLElement> & T {
  console.log('CustomElementMixin');
  return class extends target {
    constructor(...args: any[]) {
      super();
      customElements.define(tagName, target);
    }
  };
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function StateMixin<T extends Constructor<{}>>(
  target: T,
  initialState: State<EntityExample>
): Constructor<StateMixinFacade<State<EntityExample>>> & T {
  console.log('StateMixin');
  return class extends target {
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
  target: T
): Constructor<Menu> & T {
  console.log('MenuMixin');
  return class extends target {
    menuOpen: boolean = false;
    toggleMenu(): void {
      this.menuOpen = !this.menuOpen;
    }
  };
}

class Component extends CustomElementMixin(
  StateMixin(MenuMixin(HTMLElement), initialState),
  'custom-tag'
) {
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
