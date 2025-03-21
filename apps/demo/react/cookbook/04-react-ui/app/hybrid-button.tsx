import { cva } from 'class-variance-authority';
import React from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    defaultVariants: {
      size: 'medium',
      variant: 'primary',
    },
    variants: {
      size: {
        large: 'px-6 py-3 text-lg',
        medium: 'px-4 py-2 text-base',
        small: 'px-2 py-1 text-sm',
      },
      variant: {
        danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
        primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500',
        secondary:
          'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500',
      },
    },
  }
);

interface HybridButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  size?: 'large' | 'medium' | 'small';
  variant?: 'danger' | 'primary' | 'secondary';
}

const HybridButton: React.FC<HybridButtonProps> = ({
  size,
  variant,
  ...props
}) => {
  return <button className={buttonVariants({ size, variant })} {...props} />;
};

export default HybridButton;
