"use client";

import {
  CircleCheck,
  CircleX,
  Info,
  Loader2,
  TriangleAlert,
  X,
} from "lucide-react";
import { Toaster as Sonner, type ToasterProps, toast } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "w-full flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm",
          title: "text-sm font-semibold leading-5",
          description: "text-xs leading-4 mt-0.5 opacity-80",
          actionButton:
            "text-xs font-medium px-3 py-1.5 rounded-lg transition-colors",
          closeButton:
            "absolute top-3 right-3 opacity-50 hover:opacity-100 transition-opacity",
          success:
            "bg-emerald-50 border-emerald-200 text-emerald-900 [&_[data-icon]]:text-emerald-600",
          error:
            "bg-red-50 border-red-200 text-red-900 [&_[data-icon]]:text-red-600",
          warning:
            "bg-amber-50 border-amber-200 text-amber-900 [&_[data-icon]]:text-amber-600",
          info: "bg-blue-50 border-blue-200 text-blue-900 [&_[data-icon]]:text-blue-600",
          loading:
            "bg-white border-border text-foreground [&_[data-icon]]:text-muted-foreground",
        },
      }}
      icons={{
        success: (
          <div data-icon className="shrink-0 mt-0.5">
            <CircleCheck className="size-4.5" strokeWidth={2} />
          </div>
        ),
        error: (
          <div data-icon className="shrink-0 mt-0.5">
            <CircleX className="size-4.5" strokeWidth={2} />
          </div>
        ),
        warning: (
          <div data-icon className="shrink-0 mt-0.5">
            <TriangleAlert className="size-4.5" strokeWidth={2} />
          </div>
        ),
        info: (
          <div data-icon className="shrink-0 mt-0.5">
            <Info className="size-4.5" strokeWidth={2} />
          </div>
        ),
        loading: (
          <div data-icon className="shrink-0 mt-0.5">
            <Loader2 className="size-4.5 animate-spin" strokeWidth={2} />
          </div>
        ),
      }}
      closeButton
      {...props}
    />
  );
};

export { Toaster, toast };
