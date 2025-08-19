import { createFeatureSelector, createSelector } from '@ngrx/store';
import { <%= classify(name) %>State } from './<%= dasherize(name) %>.reducer';

export const select<%= classify(name) %>State = createFeatureSelector<<%= classify(name) %>State>('<%= camelize(name) %>');

export const select<%= classify(name) %>s = createSelector(
  select<%= classify(name) %>State,
  (state: <%= classify(name) %>State) => state.<%= camelize(name) %>s
);

export const selectSelected<%= classify(name) %> = createSelector(
  select<%= classify(name) %>State,
  (state: <%= classify(name) %>State) => state.selected<%= classify(name) %>
);

export const select<%= classify(name) %>Loading = createSelector(
  select<%= classify(name) %>State,
  (state: <%= classify(name) %>State) => state.loading
);

export const select<%= classify(name) %>Error = createSelector(
  select<%= classify(name) %>State,
  (state: <%= classify(name) %>State) => state.error
);

export const select<%= classify(name) %>ById = (id: string) => createSelector(
  select<%= classify(name) %>s,
  (<%= camelize(name) %>s: any[]) => <%= camelize(name) %>s.find(<%= camelize(name) %> => <%= camelize(name) %>.id === id)
);
