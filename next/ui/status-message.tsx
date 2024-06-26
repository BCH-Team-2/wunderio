import { useTranslation } from "next-i18next";
import React from "react";
import clsx from "clsx";
import { cva } from "cva";

import Success from "@/styles/icons/checkmark.svg";
import Error from "@/styles/icons/error.svg";
import Warning from "@/styles/icons/warning.svg";

export const variants = cva(
  "text-md text-steelgray w-full relative py-6 px-16",
  {
    variants: {
      level: {
        info: "bg-info/15",
        success: "bg-success/15",
        warning: "bg-warning/15",
        error: "bg-error/15",
      },
    },
    defaultVariants: {
      level: "info",
    },
  },
);

export interface StatusMessageProps
  extends React.HTMLAttributes<HTMLDivElement> {
  level?: "info" | "success" | "warning" | "error";
  title?: string;
  className?: string;
  children?: React.ReactNode;
}

export const StatusMessage = React.forwardRef<
  HTMLDivElement,
  StatusMessageProps
>(({ level = "info", title, className, children, ...props }, ref) => {
  const { t } = useTranslation();

  const [Icon, color] = {
    info: [Warning, "text-info"],
    success: [Success, "text-success"],
    warning: [Warning, "text-warning"],
    error: [Error, "text-error"],
  }[level];

  return (
    <div
      role="alert"
      className={clsx(variants({ level }), className)}
      ref={ref}
      {...props}
    >
      <h3 className="mb-2 relative inline-flex pl-6">
        <Icon
          className={clsx("absolute left-0 top-0 bottom-0 h-6 w-6", color)}
        />
        {title ?? t(`statusmessage-${level}`)}
      </h3>
      {children}
    </div>
  );
});
StatusMessage.displayName = "StatusMessage";
