"use client";
import React from "react";
import { cn } from "@/lib/utils";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  span?: string;
  label?: string;
  title?: string;
};

const BentoTile: React.FC<Props> = ({ className, span, label, title, children, ...rest }) => {
  return (
    <div className={cn("tile p-6 md:p-7 flex flex-col", span, className)} {...rest}>
      {(label || title) && (
        <div className="flex items-center justify-between mb-5">
          {label && <span className="label-mono">{label}</span>}
          {title && <span className="text-sm text-foreground/80">{title}</span>}
        </div>
      )}
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default BentoTile;