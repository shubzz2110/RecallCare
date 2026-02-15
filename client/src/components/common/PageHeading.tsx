import React from "react";

interface PageHeadingComponentProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function PageHeading({
  title,
  description,
  icon,
}: PageHeadingComponentProps) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="bg-card min-w-14 min-h-14 w-14 h-14 rounded-lg flex items-center justify-center shadow">
        <span className="text-muted-foreground">{icon}</span>
      </div>
      <div className="flex flex-col gap-1">
        <h1 className="text-[22px] font-semibold text-foreground">{title}</h1>
        <p className="text-muted-foreground font-normal text-sm leading-4">
          {description}
        </p>
      </div>
    </div>
  );
}
