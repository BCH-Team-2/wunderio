import React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import clsx from "clsx";
import { cva, VariantProps } from "cva";

const labelVariants = cva(
  "mb-1 block text-sm font-medium font-overpass peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

export const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={clsx(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = "Label";
