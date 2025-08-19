import { createAction, props } from '@ngrx/store';

// Load Actions
export const load<%= classify(name) %>s = createAction(
  '[<%= classify(name) %>] Load <%= classify(name) %>s'
);

export const load<%= classify(name) %>sSuccess = createAction(
  '[<%= classify(name) %>] Load <%= classify(name) %>s Success',
  props<{ <%= camelize(name) %>s: any[] }>()
);

export const load<%= classify(name) %>sFailure = createAction(
  '[<%= classify(name) %>] Load <%= classify(name) %>s Failure',
  props<{ error: any }>()
);

// Create Actions
export const create<%= classify(name) %> = createAction(
  '[<%= classify(name) %>] Create <%= classify(name) %>',
  props<{ <%= camelize(name) %>: any }>()
);

export const create<%= classify(name) %>Success = createAction(
  '[<%= classify(name) %>] Create <%= classify(name) %> Success',
  props<{ <%= camelize(name) %>: any }>()
);

export const create<%= classify(name) %>Failure = createAction(
  '[<%= classify(name) %>] Create <%= classify(name) %> Failure',
  props<{ error: any }>()
);

// Update Actions
export const update<%= classify(name) %> = createAction(
  '[<%= classify(name) %>] Update <%= classify(name) %>',
  props<{ <%= camelize(name) %>: any }>()
);

export const update<%= classify(name) %>Success = createAction(
  '[<%= classify(name) %>] Update <%= classify(name) %> Success',
  props<{ <%= camelize(name) %>: any }>()
);

export const update<%= classify(name) %>Failure = createAction(
  '[<%= classify(name) %>] Update <%= classify(name) %> Failure',
  props<{ error: any }>()
);

// Delete Actions
export const delete<%= classify(name) %> = createAction(
  '[<%= classify(name) %>] Delete <%= classify(name) %>',
  props<{ id: string }>()
);

export const delete<%= classify(name) %>Success = createAction(
  '[<%= classify(name) %>] Delete <%= classify(name) %> Success',
  props<{ id: string }>()
);

export const delete<%= classify(name) %>Failure = createAction(
  '[<%= classify(name) %>] Delete <%= classify(name) %> Failure',
  props<{ error: any }>()
);

// Select Actions
export const select<%= classify(name) %> = createAction(
  '[<%= classify(name) %>] Select <%= classify(name) %>',
  props<{ id: string }>()
);

export const clear<%= classify(name) %>Selection = createAction(
  '[<%= classify(name) %>] Clear <%= classify(name) %> Selection'
);
