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
    increment() {
      patchState(store, (state) => ({ count: state.count + 1 }));
    },
    decrement() {
      patchState(store, (state) => ({ count: state.count - 1 }));
    },
    setCount(value: number) {
      patchState(store, () => ({ count: value }));
    },
  })),
  withHooks({
    onInit(store) {
      console.log('init', store);
    },
    onDestroy(store) {
      console.log('destroy', store);
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
    onDestroy(store) {
      localStorage.removeItem('theme');
    },
  }),
);
