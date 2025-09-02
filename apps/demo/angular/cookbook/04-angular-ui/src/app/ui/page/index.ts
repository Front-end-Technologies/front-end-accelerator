import { NgModule } from '@angular/core';

import { PageComponent } from './page.component';

export * from './page.component';

@NgModule({
    imports: [PageComponent],
    exports: [PageComponent],
})
export class PageModule {}
