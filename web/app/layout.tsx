import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Recallcare",
    default: "Recallcare",
  },
  description:
    "RecallCare helps clinics automatically send appointment reminders and follow-up messages to patients. Reduce missed visits and bring patients back without manual calling.",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <SidebarProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster position="top-center" />
        </SidebarProvider>
      </body>
    </html>
  );
}
