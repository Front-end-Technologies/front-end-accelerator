import { createReducer, on } from '@ngrx/store';
import * as <%= classify(name) %>Actions from './<%= dasherize(name) %>.actions';

export interface <%= classify(name) %>State {
  <%= camelize(name) %>s: any[];
  selected<%= classify(name) %>: any | null;
  loading: boolean;
  error: any | null;
}

export const initial<%= classify(name) %>State: <%= classify(name) %>State = {
  <%= camelize(name) %>s: [],
  selected<%= classify(name) %>: null,
  loading: false,
  error: null
};

export const <%= camelize(name) %>Reducer = createReducer(
  initial<%= classify(name) %>State,

  // Load Actions
  on(<%= classify(name) %>Actions.load<%= classify(name) %>s, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(<%= classify(name) %>Actions.load<%= classify(name) %>sSuccess, (state, { <%= camelize(name) %>s }) => ({
    ...state,
    <%= camelize(name) %>s,
    loading: false,
    error: null
  })),

  on(<%= classify(name) %>Actions.load<%= classify(name) %>sFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Create Actions
  on(<%= classify(name) %>Actions.create<%= classify(name) %>, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(<%= classify(name) %>Actions.create<%= classify(name) %>Success, (state, { <%= camelize(name) %> }) => ({
    ...state,
    <%= camelize(name) %>s: [...state.<%= camelize(name) %>s, <%= camelize(name) %>],
    loading: false,
    error: null
  })),

  on(<%= classify(name) %>Actions.create<%= classify(name) %>Failure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Update Actions
  on(<%= classify(name) %>Actions.update<%= classify(name) %>, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(<%= classify(name) %>Actions.update<%= classify(name) %>Success, (state, { <%= camelize(name) %> }) => ({
    ...state,
    <%= camelize(name) %>s: state.<%= camelize(name) %>s.map(item => 
      item.id === <%= camelize(name) %>.id ? <%= camelize(name) %> : item
    ),
    selected<%= classify(name) %>: state.selected<%= classify(name) %>?.id === <%= camelize(name) %>.id ? <%= camelize(name) %> : state.selected<%= classify(name) %>,
    loading: false,
    error: null
  })),

  on(<%= classify(name) %>Actions.update<%= classify(name) %>Failure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Delete Actions
  on(<%= classify(name) %>Actions.delete<%= classify(name) %>, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(<%= classify(name) %>Actions.delete<%= classify(name) %>Success, (state, { id }) => ({
    ...state,
    <%= camelize(name) %>s: state.<%= camelize(name) %>s.filter(item => item.id !== id),
    selected<%= classify(name) %>: state.selected<%= classify(name) %>?.id === id ? null : state.selected<%= classify(name) %>,
    loading: false,
    error: null
  })),

  on(<%= classify(name) %>Actions.delete<%= classify(name) %>Failure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Select Actions
  on(<%= classify(name) %>Actions.select<%= classify(name) %>, (state, { id }) => ({
    ...state,
    selected<%= classify(name) %>: state.<%= camelize(name) %>s.find(item => item.id === id) || null
  })),

  on(<%= classify(name) %>Actions.clear<%= classify(name) %>Selection, (state) => ({
    ...state,
    selected<%= classify(name) %>: null
  }))
);
