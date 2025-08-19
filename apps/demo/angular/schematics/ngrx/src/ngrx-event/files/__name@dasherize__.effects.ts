import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import * as <%= classify(name) %>Actions from './<%= dasherize(name) %>.actions';

@Injectable()
export class <%= classify(name) %>Effects {

  constructor(private actions$: Actions) {}

  load<%= classify(name) %>s$ = createEffect(() =>
    this.actions$.pipe(
      ofType(<%= classify(name) %>Actions.load<%= classify(name) %>s),
      switchMap(() =>
        // Replace with your actual service call
        of([]).pipe(
          map(<%= camelize(name) %>s => <%= classify(name) %>Actions.load<%= classify(name) %>sSuccess({ <%= camelize(name) %>s })),
          catchError(error => of(<%= classify(name) %>Actions.load<%= classify(name) %>sFailure({ error })))
        )
      )
    )
  );

  create<%= classify(name) %>$ = createEffect(() =>
    this.actions$.pipe(
      ofType(<%= classify(name) %>Actions.create<%= classify(name) %>),
      mergeMap(action =>
        // Replace with your actual service call
        of(action.<%= camelize(name) %>).pipe(
          map(<%= camelize(name) %> => <%= classify(name) %>Actions.create<%= classify(name) %>Success({ <%= camelize(name) %> })),
          catchError(error => of(<%= classify(name) %>Actions.create<%= classify(name) %>Failure({ error })))
        )
      )
    )
  );

  update<%= classify(name) %>$ = createEffect(() =>
    this.actions$.pipe(
      ofType(<%= classify(name) %>Actions.update<%= classify(name) %>),
      mergeMap(action =>
        // Replace with your actual service call
        of(action.<%= camelize(name) %>).pipe(
          map(<%= camelize(name) %> => <%= classify(name) %>Actions.update<%= classify(name) %>Success({ <%= camelize(name) %> })),
          catchError(error => of(<%= classify(name) %>Actions.update<%= classify(name) %>Failure({ error })))
        )
      )
    )
  );

  delete<%= classify(name) %>$ = createEffect(() =>
    this.actions$.pipe(
      ofType(<%= classify(name) %>Actions.delete<%= classify(name) %>),
      mergeMap(action =>
        // Replace with your actual service call
        of(action.id).pipe(
          map(id => <%= classify(name) %>Actions.delete<%= classify(name) %>Success({ id })),
          catchError(error => of(<%= classify(name) %>Actions.delete<%= classify(name) %>Failure({ error })))
        )
      )
    )
  );
}
