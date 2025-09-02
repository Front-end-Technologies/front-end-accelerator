import { Component } from '@angular/core';

@Component({
  template: `
    <div class="bg-blue-200 flex flex-col gap-4 rounded-2xl p-8">
      <ng-content />
    </div>
  `,
  selector: 'ectz-card',
})
export class CardComponent {}
