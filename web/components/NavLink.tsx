import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface NavLinkProps {
  to: string;
  href?: string;
  children: ReactNode;
  className?: string;
  activeClassName?: string;
  exact?: boolean;
}

export function NavLink({
  to,
  href,
  children,
  className,
  activeClassName = "text-primary font-medium",
  exact = false,
  ...props
}: NavLinkProps) {
  const pathname = usePathname();

  const linkTo = to || href || "";

  const isActive = exact ? pathname === linkTo : pathname.startsWith(linkTo);

  return (
    <Link
      href={linkTo}
      {...props}
      className={cn(
        "transition-colors text-muted-foreground hover:text-foreground",
        className,
        isActive && activeClassName,
      )}
    >
      {children}
    </Link>
  );
}
