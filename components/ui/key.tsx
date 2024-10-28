import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const keyVariants = cva(
  "flex aspect-square items-center justify-center rounded-full cursor-pointer text-4xl font-light",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        number:
          "bg-neutral-600 text-primary-foreground hover:bg-neutral-600/90",
        function: "bg-neutral-300 text-primary hover:bg-neutral-300/90",
        operator:
          "bg-orange-400 text-primary-foreground hover:bg-orange-400/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface KeyProps
  extends React.HTMLProps<HTMLDivElement>,
    VariantProps<typeof keyVariants> {}

const Key = React.forwardRef<HTMLDivElement, KeyProps>(
  ({ children, className, variant = "default", ...props }, ref) => {
    return (
      <div
        className={cn(keyVariants({ variant, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Key.displayName = "Key";

export { Key, keyVariants };
