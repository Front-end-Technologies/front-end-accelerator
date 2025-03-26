export const useToggle = () => {
  const isVisible = useState('isVisible', () => false);

  const toggle = () => {
    isVisible.value = !isVisible.value;
  };

  return {
    isVisible,
    toggle,
  };
};
