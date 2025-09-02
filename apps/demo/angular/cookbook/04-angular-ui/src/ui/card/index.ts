import { NgModule } from '@angular/core';

import { CardComponent } from './card.component';

export * from './card.component';

@NgModule({
    imports: [CardComponent],
    exports: [CardComponent],
})
export class EctzCardModule {}
