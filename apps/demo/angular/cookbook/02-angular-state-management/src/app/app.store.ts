import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState({ count: 0 }),
  withMethods((store) => ({
    decrement() {
      patchState(store, (state) => ({ count: state.count - 1 }));
    },
    increment() {
      patchState(store, (state) => ({ count: state.count + 1 }));
    },
    setCount(value: number) {
      patchState(store, () => ({ count: value }));
    },
  })),
  withHooks({
    onDestroy(store) {
      console.log('destroy', store);
    },
    onInit(store) {
      console.log('init', store);
    },
  }),
);

export const ThemeStore = signalStore(
  { providedIn: 'root' },
  withState({ theme: 'light' }),
  withMethods((store) => ({
    toggleTheme() {
      const newTheme = store.theme() === 'light' ? 'dark' : 'light';
      patchState(store, () => ({ theme: newTheme }));
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(newTheme);
      localStorage.setItem('theme', newTheme);
    },
  })),

  withHooks({
    onDestroy(store) {
      localStorage.removeItem('theme');
    },
    onInit(store) {
      const savedTheme = localStorage.getItem('theme');
      let themeToUse: string;

      if (savedTheme === 'dark' || savedTheme === 'light') {
        themeToUse = savedTheme;
      } else {
        themeToUse = store.theme();
      }

      patchState(store, () => ({ theme: themeToUse }));
      document.documentElement.classList.add(themeToUse);
      localStorage.setItem('theme', themeToUse);
    },
  }),
);
