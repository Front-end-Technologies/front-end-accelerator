import { Component } from '@angular/core';
import { EventComponent } from './event-store/event.component';

@Component({
  selector: 'app-root',
  template: `<app-event></app-event>`,
  imports: [EventComponent],
})
export class AppComponent {
  title = '01-angular-hello-world';
}
