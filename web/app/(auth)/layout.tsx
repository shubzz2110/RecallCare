import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-full h-full items-center justify-center min-h-dvh px-2.5 md:px-0">
      <div className="space-y-13.25 flex flex-col w-full h-full max-w-92">
        <div className="flex flex-col items-center space-y-2">
          <img
            src="/recallcare-logo.png"
            alt="logo"
            className="w-14 self-center"
          />
          <h1 className="text-2xl font-semibold text-center">RecallCare</h1>
        </div>
        {children}
      </div>
    </div>
  );
}
