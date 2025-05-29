import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

// Define the button variants using cva
const buttonVariants = cva(
  // Base styles applied to all buttons
  "inline-flex items-center justify-center whitespace-nowrap font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary button with gradient background
        primary: "bg-gradient-to-r from-ink-purple to-ink-indigo text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-ink-purple-light",
        
        // Secondary button with pink gradient
        secondary: "bg-gradient-to-r from-ink-purple to-ink-pink text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-ink-pink-light",
        
        // Outline button with border
        outline: "border-2 border-ink-purple text-ink-purple bg-transparent hover:bg-ink-purple/10 active:scale-[0.98] focus-visible:ring-ink-purple",
        
        // Ghost button with no background until hover
        ghost: "bg-transparent text-ink-purple hover:bg-ink-purple/10 active:scale-[0.98] focus-visible:ring-ink-purple",
        
        // Destructive button for dangerous actions
        destructive: "bg-red-600 text-white hover:bg-red-700 active:scale-[0.98] focus-visible:ring-red-500",
        
        // Link button that looks like a link
        link: "bg-transparent text-ink-purple underline-offset-4 hover:underline focus-visible:ring-ink-purple p-0 h-auto",
      },
      size: {
        sm: "text-xs px-3 py-1.5 rounded-full",
        md: "text-sm px-4 py-2 rounded-full",
        lg: "text-base px-6 py-3 rounded-full",
        icon: "h-10 w-10 rounded-full p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

// Define the Button component props
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// Create the Button component
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    // Use Slot if asChild is true, otherwise use button
    const Comp = asChild ? Slot : "button";
    
    // Determine if button should be disabled (either explicitly or due to loading)
    const isDisabled = disabled || isLoading;
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {isLoading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {!isLoading && leftIcon && (
          <span className="mr-2">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && (
          <span className="ml-2">{rightIcon}</span>
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
