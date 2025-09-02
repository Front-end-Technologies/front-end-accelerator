import { NgModule } from '@angular/core';

import { PageComponent } from './page.component';

export * from './page.component';

@NgModule({
  exports: [PageComponent],
  imports: [PageComponent],
})
export class PageModule {}
