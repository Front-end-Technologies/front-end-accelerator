import { Component, input } from '@angular/core';

@Component({
  selector: 'ectz-page',
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
})
export class PageComponent {
  title = input<string>();
}
