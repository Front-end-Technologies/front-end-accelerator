import { NgModule } from '@angular/core';
import { EctzButtonModule } from './button';
import { EctzCardModule } from './card';
import { PageModule } from './page';

export * from './button';
export * from './card';
export * from './page';

@NgModule({
  imports: [EctzButtonModule, EctzCardModule, PageModule],
  exports: [EctzButtonModule, EctzCardModule, PageModule],
})
export class EctzModule {}
