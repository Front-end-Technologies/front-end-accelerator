import { Component } from '@angular/core';
import { EventComponent } from './event-store/event.component';
import { SignalStoreComponent } from './signal-store/signal-store.component';

@Component({
  selector: 'app-root',
  template: `<app-event></app-event><app-signal-store></app-signal-store>`,
  imports: [EventComponent, SignalStoreComponent],
})
export class AppComponent {
  title = '01-angular-hello-world';
}
