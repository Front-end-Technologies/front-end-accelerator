import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppStore, ThemeStore } from './app.store';

@Component({
  imports: [FormsModule],
  selector: 'app-root',
  template: `
    <main>
      <h1>Local state management</h1>
      <h3>Signals</h3>
      <button (click)="decrement()">decrement</button>
      <button (click)="increment()">increment</button>
      <p>state: {{ count() }}</p>
      <input type="number" [(ngModel)]="inputValue" />
      <button (click)="setCount(inputValue())">set</button>
      <button (click)="resetLocalState()">clear</button>

      <h3>Derived state</h3>
      <p>re-rendered (use for frequent light changes): {{ count() * 2 }}</p>
      <p>Computed (use for heavy calculations): {{ heavyComputed() }}</p>

      <hr />

      <h1>Global state management</h1>
      <p>
        For global state we recommend ngrx Signals, it provides a powerful and
        flexible way to manage state across your application while still being
        lightweight and easy to use. Consider this instead of using a service.
      </p>
      <button (click)="store.decrement()">Decrement</button>
      <button (click)="store.increment()">Increment</button>
      <p>global state: {{ store.count() }}</p>

      <h3>2-way binding ngModel</h3>
      <input type="number" [(ngModel)]="globalInputValue" />
      <h3>1-way binding value/input</h3>
      <input
        type="number"
        [value]="globalInputValue()"
        (input)="globalInputValue.set(toNumber($event.target.value))"
      />
      <button (click)="store.setCount(globalInputValue())">Set Global</button>
      <button (click)="resetGlobalState()">Clear Global</button>

      <hr />
      <h1>Effect</h1>
      <p>Effect: {{ effectValue() }}</p>

      <hr />
      <h1>Light / Dark mode</h1>
      <button (click)="themeStore.toggleTheme()">Toggle Theme</button>
    </main>
  `,
})
export class App {
  // Local state
  readonly count = signal(0);
  readonly effectValue = signal('');
  readonly heavyComputed = computed(() => {
    const n = this.count();
    const fib = (num: number): number => {
      if (num <= 1) return num;
      let a = 0,
        b = 1;
      for (let i = 2; i <= num; i++) {
        [a, b] = [b, a + b];
      }
      return b;
    };
    let sum = 0;
    for (let i = 0; i < 100000; i++) {
      sum += fib(n % 20);
    }
    return `Heavy computed result: ${sum}`;
  });

  // Global state
  readonly store = inject(AppStore);

  // Effects
  readonly countEffect = effect(() => {
    this.effectValue.set(
      `this is an effect, that tracks count(${this.count()}), heavy computed(${this.heavyComputed()}) and global state ${this.store.count()}`,
    );
  });

  readonly globalInputValue = signal(0);

  readonly inputValue = signal(0);

  // Theme
  readonly themeStore = inject(ThemeStore);

  decrement() {
    this.count.update((c) => c - 1);
  }
  increment() {
    this.count.update((c) => c + 1);
  }

  resetGlobalState() {
    this.store.setCount(0);
    this.globalInputValue.set(0);
  }

  resetLocalState() {
    this.count.set(0);
    this.inputValue.set(0);
  }

  setCount(value: number) {
    this.count.set(Number(value));
  }

  toNumber(value: string): number {
    return Number(value);
  }
}
