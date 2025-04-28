import { useCallback, useState } from "react";

export function useToggle(initialValue: boolean = false): {
  open: boolean;
  setToggle: (value: boolean) => void;
  toggle: () => void;
} {
  const [open, setOpen] = useState(initialValue);

  const toggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const setToggle = useCallback((value: boolean) => {
    setOpen(value);
  }, []);

  return { open, setToggle, toggle };
}
