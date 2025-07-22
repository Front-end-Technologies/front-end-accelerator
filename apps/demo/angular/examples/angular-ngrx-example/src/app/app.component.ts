import { Component } from '@angular/core';
import { EventComponent } from './event-store/event.component';
import { SignalStoreComponent } from './signal-store/signal-store.component';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div class="app-container">
      <div class="column">
        <app-event></app-event>
      </div>
      <div class="column">
        <app-signal-store></app-signal-store>
      </div>
    </div>
  `,
  styleUrl: './app.component.scss',
  imports: [EventComponent, SignalStoreComponent],
})
export class AppComponent {
  title = '01-angular-hello-world';
}
