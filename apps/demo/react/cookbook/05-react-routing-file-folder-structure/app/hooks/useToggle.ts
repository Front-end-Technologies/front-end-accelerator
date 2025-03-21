import { useCallback, useState } from 'react';

const useToggle = (initialValue: boolean = false) => {
  const [value, setValue] = useState(initialValue);

  const show = useCallback(() => {
    setValue(true);
  }, []);

  const hide = useCallback(() => {
    setValue(false);
  }, []);

  return {
    hide,
    show,
    toggle: () => setValue((v) => !v),
    value,
  };
};

export default useToggle;
