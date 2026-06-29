import { NavLink } from "react-router-dom";
import { Coins, Home, Shuffle, Clock } from "lucide-react";

type NavItem = {
  path: string;
  label: string;
  Icon: typeof Home;
};

const navItems: NavItem[] = [
  { path: "/", label: "Início", Icon: Home },
  { path: "/roleta", label: "Roleta", Icon: Shuffle },
  { path: "/tokens", label: "Tokens", Icon: Coins },
  { path: "/timeline", label: "Timeline", Icon: Clock },
];

export function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 flex bg-card border-t border-border pb-[env(safe-area-inset-bottom)]">
      {navItems.map(({ path, label, Icon }) => (
        <NavLink
          key={path}
          to={path}
          end={path === "/"}
          className={({ isActive }) =>
            `relative flex-1 flex flex-col items-center gap-1 py-3 transition-all duration-150 ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`
          }
        >
          <Icon className="w-5 h-5 transition-all" />
          <span className="text-[10px] tracking-wide font-normal">{label}</span>
          <div className="absolute bottom-0 h-0.5 w-8 rounded-full bg-primary opacity-0 transition-opacity duration-150" />
        </NavLink>
      ))}
    </nav>
  );
}
