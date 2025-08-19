import * as <%= classify(name) %>Actions from './<%= dasherize(name) %>.actions';

describe('<%= classify(name) %> Actions', () => {
  describe('load<%= classify(name) %>s', () => {
    it('should create an action', () => {
      const action = <%= classify(name) %>Actions.load<%= classify(name) %>s();
      expect(action.type).toBe('[<%= classify(name) %>] Load <%= classify(name) %>s');
    });
  });

  describe('load<%= classify(name) %>sSuccess', () => {
    it('should create an action', () => {
      const <%= camelize(name) %>s = [{ id: '1', name: 'Test' }];
      const action = <%= classify(name) %>Actions.load<%= classify(name) %>sSuccess({ <%= camelize(name) %>s });
      expect(action.type).toBe('[<%= classify(name) %>] Load <%= classify(name) %>s Success');
      expect(action.<%= camelize(name) %>s).toEqual(<%= camelize(name) %>s);
    });
  });

  describe('load<%= classify(name) %>sFailure', () => {
    it('should create an action', () => {
      const error = new Error('Test error');
      const action = <%= classify(name) %>Actions.load<%= classify(name) %>sFailure({ error });
      expect(action.type).toBe('[<%= classify(name) %>] Load <%= classify(name) %>s Failure');
      expect(action.error).toEqual(error);
    });
  });

  describe('create<%= classify(name) %>', () => {
    it('should create an action', () => {
      const <%= camelize(name) %> = { id: '1', name: 'Test' };
      const action = <%= classify(name) %>Actions.create<%= classify(name) %>({ <%= camelize(name) %> });
      expect(action.type).toBe('[<%= classify(name) %>] Create <%= classify(name) %>');
      expect(action.<%= camelize(name) %>).toEqual(<%= camelize(name) %>);
    });
  });

  describe('select<%= classify(name) %>', () => {
    it('should create an action', () => {
      const id = '1';
      const action = <%= classify(name) %>Actions.select<%= classify(name) %>({ id });
      expect(action.type).toBe('[<%= classify(name) %>] Select <%= classify(name) %>');
      expect(action.id).toBe(id);
    });
  });
});
