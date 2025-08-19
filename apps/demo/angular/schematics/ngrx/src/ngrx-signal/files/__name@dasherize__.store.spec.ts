import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { <%= classify(name) %>Store, <%= classify(name) %> } from './<%= dasherize(name) %>.store';
import { <%= classify(name) %>Service } from './<%= dasherize(name) %>.service';

describe('<%= classify(name) %>Store', () => {
  let store: InstanceType<typeof <%= classify(name) %>Store>;
  let httpMock: HttpTestingController;
  let service: <%= classify(name) %>Service;

  const mock<%= classify(name) %>: <%= classify(name) %> = {
    id: '1',
    // TODO: Add mock properties based on your interface
  };

  const mock<%= classify(name) %>s: <%= classify(name) %>[] = [
    mock<%= classify(name) %>,
    {
      id: '2',
      // TODO: Add mock properties based on your interface
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        <%= classify(name) %>Service,
      ],
    });

    store = TestBed.inject(<%= classify(name) %>Store);
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(<%= classify(name) %>Service);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      expect(store.<%= camelize(name) %>s()).toEqual([]);
      expect(store.selectedId()).toBeNull();
      expect(store.isLoading()).toBe(false);
      expect(store.error()).toBeNull();
      expect(store.selected<%= classify(name) %>()).toBeNull();
      expect(store.<%= camelize(name) %>Count()).toBe(0);
      expect(store.has<%= classify(name) %>s()).toBe(false);
    });
  });

  describe('computed signals', () => {
    beforeEach(() => {
      // Set up some initial state for testing computed properties
      store.<%= camelize(name) %>s.set(mock<%= classify(name) %>s);
    });

    it('should compute <%= camelize(name) %>Count correctly', () => {
      expect(store.<%= camelize(name) %>Count()).toBe(2);
    });

    it('should compute has<%= classify(name) %>s correctly', () => {
      expect(store.has<%= classify(name) %>s()).toBe(true);
      
      store.<%= camelize(name) %>s.set([]);
      expect(store.has<%= classify(name) %>s()).toBe(false);
    });

    it('should compute selected<%= classify(name) %> correctly', () => {
      store.selectedId.set('1');
      expect(store.selected<%= classify(name) %>()).toEqual(mock<%= classify(name) %>);
      
      store.selectedId.set('nonexistent');
      expect(store.selected<%= classify(name) %>()).toBeNull();
    });
  });

  describe('methods', () => {
    describe('select<%= classify(name) %>', () => {
      it('should set selectedId', () => {
        store.select<%= classify(name) %>('1');
        expect(store.selectedId()).toBe('1');
      });
    });

    describe('clearSelection', () => {
      it('should clear selectedId', () => {
        store.selectedId.set('1');
        store.clearSelection();
        expect(store.selectedId()).toBeNull();
      });
    });

    describe('clearError', () => {
      it('should clear error', () => {
        store.error.set('Some error');
        store.clearError();
        expect(store.error()).toBeNull();
      });
    });
  });

  // TODO: Add tests for async methods (load<%= classify(name) %>s, create<%= classify(name) %>, etc.)
  // These tests would need to mock the service calls and test the rxMethod behavior
  // Example:
  // describe('load<%= classify(name) %>s', () => {
  //   it('should load <%= camelize(name) %>s successfully', () => {
  //     store.load<%= classify(name) %>s();
  //     
  //     const req = httpMock.expectOne('/api/<%= dasherize(name) %>s');
  //     expect(req.request.method).toBe('GET');
  //     req.flush(mock<%= classify(name) %>s);
  //     
  //     expect(store.<%= camelize(name) %>s()).toEqual(mock<%= classify(name) %>s);
  //     expect(store.isLoading()).toBe(false);
  //   });
  // });
});
