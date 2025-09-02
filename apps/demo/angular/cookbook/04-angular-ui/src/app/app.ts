import { Component } from '@angular/core';
import { EctzButtonModule, EctzCardModule, PageModule } from '../ui';

@Component({
  imports: [EctzButtonModule, EctzCardModule, PageModule],
  selector: 'app-root',
  template: `
    <main class="ectz p-4">
      <ectz-page
        title="Ectz Design system abstraction with Tailwind 4 and Class Variance authority"
      >
        <div class="grid grid-cols-3 gap-4">
          <ectz-card> This is a Card </ectz-card>
          <ectz-card> This is a Card </ectz-card>
          <ectz-card> This is a Card </ectz-card>
        </div>

        <button ectzButton variant="primary" size="lg">
          Primary Large Button
        </button>
        <button ectzButton variant="primary" size="md">
          Primary Medium Button
        </button>
        <button ectzButton variant="primary" size="sm">
          Primary Small Button
        </button>

        <button ectzButton variant="secondary" size="lg">
          Secondary Large Button
        </button>
        <button ectzButton variant="secondary" size="md">
          Secondary Medium Button
        </button>
        <button ectzButton variant="secondary" size="sm">
          Secondary Small Button
        </button>
      </ectz-page>
    </main>
  `,
})
export class App {}
