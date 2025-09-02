import { Component, input } from '@angular/core';

@Component({
  template: `
    <section class="flex flex-col gap-8">
      @if (title()) {
        <h1 class="text-4xl! font-bold!">
          {{ title() }}
        </h1>
      }
      <ng-content />
    </section>
  `,
  selector: 'ectz-page',
})
export class PageComponent {
  title = input<string>();
}
