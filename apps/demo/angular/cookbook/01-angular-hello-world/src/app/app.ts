import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <main>
      <h1>{{ title() }}</h1>
    </main>
  `,
})
export class App {
  protected readonly title = signal('Hello World!');
}
