import { useVirtualizer } from '@tanstack/react-virtual';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export function App() {
  const [title] = useState('Hello World');
  const [count, setCount] = useState(0);

  // Derived state example
  const derivedTitle = `${title} - Count: ${count}`;

  // useMemo example
  const memoizedValue = useMemo(() => {
    return count * 2;
  }, [count]);

  // useCallback example
  const increment = useCallback(() => {
    setCount((prevCount) => prevCount + 1);
  }, []);

  // debounced search example
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    // Perform search with debouncedSearchTerm
    console.log('Searching for:', debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  // Tanstack Virtualization
  const parentRef = useRef(null);
  const rowVirtualizer = useVirtualizer({
    count: 10000,
    estimateSize: () => 35,
    getScrollElement: () => parentRef.current,
    overscan: 5,
  });

  return (
    <div>
      <h1>Derived state</h1>
      <p>
        Derived state is a state that is computed based on other state values.
        It helps in reducing redundant state and ensures that the state is
        always in sync. By deriving the title with the count, we avoid the need
        to manually update the title whenever the count changes, thus reducing
        potential bugs and improving code maintainability.
      </p>
      <p>
        Derived Title combining Helloworld with count:{' '}
        <strong>{derivedTitle}</strong>
      </p>
      <h1>useMemo</h1>
      <p>
        The <code>useMemo</code> hook is used to memoize expensive calculations
        and avoid unnecessary re-computations. By memoizing the value of{' '}
        <code>count * 2</code>, we ensure that the calculation is only performed
        when the <code>count</code> value changes. This optimization can
        significantly improve performance, especially in components with complex
        calculations or when dealing with large data sets.
      </p>
      <p>
        Memoized Value: <strong>{memoizedValue}</strong>
      </p>
      <h1>useCallback</h1>
      <p>
        The <code>useCallback</code> hook is used to memoize functions, ensuring
        that the same function instance is returned between renders unless its
        dependencies change. This is particularly useful when passing callbacks
        to child components, as it prevents unnecessary re-renders caused by
        function identity changes. By memoizing the <code>increment</code>{' '}
        function, we ensure that it remains stable and does not trigger
        re-renders of child components that depend on it, thus optimizing
        performance.
      </p>
      <button onClick={increment}>Increment</button>
      <h1>Debounced search</h1>
      <p>
        The debounced search term has a delay of 500 milliseconds. This delay is
        implemented to reduce the number of search operations performed,
        especially when the user is typing quickly. By waiting for 500
        milliseconds after the user stops typing, we can ensure that the search
        operation is only performed when the user has finished typing, thus
        improving performance and reducing unnecessary API calls.
      </p>
      <input
        onChange={handleSearchChange}
        placeholder="Search..."
        type="text"
        value={searchTerm}
      />
      <p>
        result after 500ms: <strong>{debouncedSearchTerm}</strong>
      </p>

      <h1>React Virtualization</h1>
      <p>
        React virtualization is a technique used to efficiently render large
        lists or grids by only rendering the visible items and a small buffer
        around them. This can significantly improve performance by reducing the
        number of DOM nodes created and updated.
      </p>
      <div
        className="List"
        ref={parentRef}
        style={{
          border: '1px solid black',
          height: `200px`,
          overflow: 'auto',
          width: `400px`,
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: 'relative',
            width: '100%',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => (
            <div
              className={virtualRow.index % 2 ? 'ListItemOdd' : 'ListItemEven'}
              key={virtualRow.index}
              style={{
                backgroundColor: virtualRow.index % 2 ? '#f0f0f0' : '#ffffff',
                height: `${virtualRow.size}px`,
                left: 0,
                position: 'absolute',
                top: 0,
                transform: `translateY(${virtualRow.start}px)`,
                width: '100%',
              }}
            >
              Row {virtualRow.index}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
