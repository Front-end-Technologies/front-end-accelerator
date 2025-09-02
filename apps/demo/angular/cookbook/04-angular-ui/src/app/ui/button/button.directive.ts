import {
  HostBinding,
  Directive,
  OnChanges,
  Input,
  input,
  effect,
} from '@angular/core';
import { VariantProps, cva } from 'class-variance-authority';

const buttonStyles = cva('ectz-btn', {
  variants: {
    variant: {
      secondary: 'ectz-btn--secondary',
      primary: 'ectz-btn--primary',
      default: '',
    },
    size: {
      sm: 'ectz-btn--sm',
      md: 'ectz-btn--md',
      lg: 'ectz-btn--lg',
    },
  },
});

type ButtonVariantProps = VariantProps<typeof buttonStyles>;

@Directive({
  selector: '[ectzButton]',
})
export class ButtonDirective {
  @HostBinding('class') classes = '';

  variant = input<ButtonVariantProps['variant']>('default');
  size = input<ButtonVariantProps['size'] | undefined>('md');

  buttonEffect = effect(() => {
    this.classes = buttonStyles({ variant: this.variant(), size: this.size() });
  });
}
