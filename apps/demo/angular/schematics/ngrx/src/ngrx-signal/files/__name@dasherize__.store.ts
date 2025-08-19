import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
  withHooks,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, EMPTY } from 'rxjs';

// TODO: Replace with your actual service
// import { <%= classify(name) %>Service } from './<%= dasherize(name) %>.service';

// TODO: Replace with your actual model interface
export interface <%= classify(name) %> {
  id: string;
  // Add your properties here
}

interface <%= classify(name) %>State {
  <%= camelize(name) %>s: <%= classify(name) %>[];
  selectedId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initial<%= classify(name) %>State: <%= classify(name) %>State = {
  <%= camelize(name) %>s: [],
  selectedId: null,
  isLoading: false,
  error: null,
};

export const <%= classify(name) %>Store = signalStore(
  { providedIn: 'root' },
  withState(initial<%= classify(name) %>State),
  
  withComputed(({ <%= camelize(name) %>s, selectedId }) => ({
    selected<%= classify(name) %>: computed(() => {
      const id = selectedId();
      return id ? <%= camelize(name) %>s().find(<%= camelize(name) %> => <%= camelize(name) %>.id === id) ?? null : null;
    }),
    
    <%= camelize(name) %>Count: computed(() => <%= camelize(name) %>s().length),
    
    has<%= classify(name) %>s: computed(() => <%= camelize(name) %>s().length > 0),
  })),
  
  withMethods((store) => {
    // TODO: Inject your service here
    // const <%= camelize(name) %>Service = inject(<%= classify(name) %>Service);
    
    return {
      // Local state methods
      select<%= classify(name) %>(id: string): void {
        patchState(store, { selectedId: id });
      },
      
      clearSelection(): void {
        patchState(store, { selectedId: null });
      },
      
      clearError(): void {
        patchState(store, { error: null });
      },
      
      // Async methods using rxMethod
      load<%= classify(name) %>s: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap(() => {
            // TODO: Replace with actual service call
            // return <%= camelize(name) %>Service.getAll().pipe(
            //   tap((<%= camelize(name) %>s) => patchState(store, { <%= camelize(name) %>s, isLoading: false })),
            //   catchError((error) => {
            //     patchState(store, { error: error.message, isLoading: false });
            //     return EMPTY;
            //   })
            // );
            
            // Placeholder implementation
            console.warn('TODO: Implement <%= camelize(name) %>Service.getAll()');
            patchState(store, { isLoading: false });
            return EMPTY;
          })
        )
      ),
      
      create<%= classify(name) %>: rxMethod<<%= classify(name) %>>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap((<%= camelize(name) %>) => {
            // TODO: Replace with actual service call
            // return <%= camelize(name) %>Service.create(<%= camelize(name) %>).pipe(
            //   tap((created<%= classify(name) %>) => {
            //     patchState(store, (state) => ({
            //       <%= camelize(name) %>s: [...state.<%= camelize(name) %>s, created<%= classify(name) %>],
            //       isLoading: false
            //     }));
            //   }),
            //   catchError((error) => {
            //     patchState(store, { error: error.message, isLoading: false });
            //     return EMPTY;
            //   })
            // );
            
            // Placeholder implementation
            console.warn('TODO: Implement <%= camelize(name) %>Service.create()');
            patchState(store, { isLoading: false });
            return EMPTY;
          })
        )
      ),
      
      update<%= classify(name) %>: rxMethod<{ id: string; changes: Partial<<%= classify(name) %>> }>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap(({ id, changes }) => {
            // TODO: Replace with actual service call
            // return <%= camelize(name) %>Service.update(id, changes).pipe(
            //   tap((updated<%= classify(name) %>) => {
            //     patchState(store, (state) => ({
            //       <%= camelize(name) %>s: state.<%= camelize(name) %>s.map(<%= camelize(name) %> =>
            //         <%= camelize(name) %>.id === id ? updated<%= classify(name) %> : <%= camelize(name) %>
            //       ),
            //       isLoading: false
            //     }));
            //   }),
            //   catchError((error) => {
            //     patchState(store, { error: error.message, isLoading: false });
            //     return EMPTY;
            //   })
            // );
            
            // Placeholder implementation
            console.warn('TODO: Implement <%= camelize(name) %>Service.update()');
            patchState(store, { isLoading: false });
            return EMPTY;
          })
        )
      ),
      
      delete<%= classify(name) %>: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap((id) => {
            // TODO: Replace with actual service call
            // return <%= camelize(name) %>Service.delete(id).pipe(
            //   tap(() => {
            //     patchState(store, (state) => ({
            //       <%= camelize(name) %>s: state.<%= camelize(name) %>s.filter(<%= camelize(name) %> => <%= camelize(name) %>.id !== id),
            //       selectedId: state.selectedId === id ? null : state.selectedId,
            //       isLoading: false
            //     }));
            //   }),
            //   catchError((error) => {
            //     patchState(store, { error: error.message, isLoading: false });
            //     return EMPTY;
            //   })
            // );
            
            // Placeholder implementation
            console.warn('TODO: Implement <%= camelize(name) %>Service.delete()');
            patchState(store, { isLoading: false });
            return EMPTY;
          })
        )
      ),
    };
  }),
  
  withHooks({
    onInit(store) {
      // Load initial data when the store is initialized
      store.load<%= classify(name) %>s();
    },
  })
);
