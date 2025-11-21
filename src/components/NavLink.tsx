import { forwardRef } from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface BottomNavLinkProps {
  to: string;
  icon: LucideIcon;
  label: string;
}

export const NavLink = forwardRef<HTMLAnchorElement, BottomNavLinkProps>(
  ({ to, icon: Icon, label }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        className={({ isActive }) =>
          cn(
            "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[60px]",
            isActive
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          )
        }
      >
        <Icon className="h-5 w-5" />
        <span className="text-xs font-medium">{label}</span>
      </RouterNavLink>
    );
  }
);

NavLink.displayName = "NavLink";
