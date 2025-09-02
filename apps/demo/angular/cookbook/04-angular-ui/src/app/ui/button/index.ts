import { NgModule } from '@angular/core';

import { ButtonDirective } from './button.directive';

export * from './button.directive';

@NgModule({
    imports: [ButtonDirective],
    exports: [ButtonDirective],
})
export class EctzButtonModule {}
