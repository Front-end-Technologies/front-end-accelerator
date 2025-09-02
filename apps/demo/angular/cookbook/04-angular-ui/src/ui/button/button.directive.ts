import { Directive, effect, HostBinding, input } from '@angular/core';
import { cva, VariantProps } from 'class-variance-authority';

const buttonStyles = cva('ectz-btn', {
  variants: {
    size: {
      lg: 'ectz-btn--lg',
      md: 'ectz-btn--md',
      sm: 'ectz-btn--sm',
    },
    variant: {
      default: '',
      primary: 'ectz-btn--primary',
      secondary: 'ectz-btn--secondary',
    },
  },
});

type ButtonVariantProps = VariantProps<typeof buttonStyles>;

@Directive({
  selector: '[ectzButton]',
})
export class ButtonDirective {
  @HostBinding('class') classes = '';

  size = input<ButtonVariantProps['size'] | undefined>('md');
  variant = input<ButtonVariantProps['variant']>('default');

  buttonEffect = effect(() => {
    this.classes = buttonStyles({ size: this.size(), variant: this.variant() });
  });
}
