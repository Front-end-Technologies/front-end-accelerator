import { NgModule } from '@angular/core';

import { CardComponent } from './card.component';

export * from './card.component';

@NgModule({
  exports: [CardComponent],
  imports: [CardComponent],
})
export class EctzCardModule {}
