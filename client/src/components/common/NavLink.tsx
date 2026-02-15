import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";
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
  const location = useLocation();
  const pathname = location.pathname;

  const linkTo = to || href || "";

  const isActive = exact ? pathname === linkTo : pathname.startsWith(linkTo);

  return (
    <Link
      to={linkTo}
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
