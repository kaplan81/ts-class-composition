import * as rxjs from 'rxjs';

(() => {
  type Constructor<T = {}> = new (...args: any[]) => T;

  interface RenderingApp {
    components: RenderedComponentMap;
  }

  interface StateApp<S> {
    state$: rxjs.Observable<S>;
    resetState(): void;
    updateState(state: S): void;
  }

  interface MenuApp {
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
      data: any;
    };
  }

  type RenderedComponentMap = Map<any, RenderingStrategy>;

  type RenderingStrategy = 'eager' | 'lazy';

  const emptyBase: Constructor = class {};
  const eagerComponent: any = {};
  const lazyComponent: any = {};
  const components: RenderedComponentMap = new Map([
    [eagerComponent, 'eager'],
    [lazyComponent, 'lazy'],
  ]);
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

  function shareReplayForMulticast<T>(): rxjs.MonoTypeOperatorFunction<T> {
    return rxjs.shareReplay({ bufferSize: 1, refCount: true });
  }

  function CustomElementDecorator<B extends Constructor<HTMLElement>>(
    tagName: string
  ): (Base: B, context: ClassDecoratorContext) => B {
    return (Base: B, context: ClassDecoratorContext) => {
      context.addInitializer(() => {
        customElements.define(tagName, Base);
      });
      return Base;
    };
  }

  function RenderingMixin<B extends Constructor>(
    Base: B,
    renderingApp: RenderingApp
  ): Constructor<RenderingApp> & B {
    return class extends Base {
      components: RenderedComponentMap = renderingApp.components;
    };
  }

  function StateMixin<B extends Constructor>(
    Base: B,
    initialState: State<EntityExample>
  ): Constructor<StateApp<State<EntityExample>>> & B {
    return class extends Base {
      #dispatch$: rxjs.BehaviorSubject<State<EntityExample>>;
      #initialState: State<EntityExample> = initialState;
      state$: rxjs.Observable<State<EntityExample>>;

      constructor(...args: any[]) {
        super(...args);
        this.#dispatch$ = new rxjs.BehaviorSubject<State<EntityExample>>(
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

  function MenuMixin<B extends Constructor>(Base: B): Constructor<MenuApp> & B {
    return class extends Base {
      menuOpen: boolean = false;
      toggleMenu(): void {
        this.menuOpen = !this.menuOpen;
      }
    };
  }

  @CustomElementDecorator('custom-tag')
  class AppComponent extends RenderingMixin(
    StateMixin(MenuMixin(HTMLElement), initialState),
    {
      components,
    }
  ) {
    property = 'property';

    method(): string {
      return 'method';
    }
  }

  const component = new AppComponent();

  console.log('AppComponent property:::', component.property);
  console.log('AppComponent method():::', component.method());
  console.log(
    'AppComponent components.get(eagerComponent) <---:::',
    component.components.get(eagerComponent)
  );
  console.log(
    'AppComponent components.get(lazyComponent) <---:::',
    component.components.get(lazyComponent)
  );
  component.state$
    .pipe(rxjs.take(1))
    .subscribe((state: State<EntityExample>) =>
      console.log('AppComponent state <---:::', state)
    );
  console.log(
    'AppComponen menuOpen before toggleMenu() <---:::',
    component.menuOpen
  );
  component.toggleMenu();
  console.log(
    'component menuOpen after toggleMenu() <---:::',
    component.menuOpen
  );
})();
