import { ChevronRight, Coins, Heart, Home, Shuffle, Clock } from "lucide-react";
import { NavLink } from "react-router-dom";

type SidebarProps = {
  balance: number;
};

const navItems = [
  { path: "/", label: "Início", Icon: Home },
  { path: "/roleta", label: "Roleta", Icon: Shuffle },
  { path: "/tokens", label: "Tokens", Icon: Coins },
  { path: "/timeline", label: "Timeline", Icon: Clock },
];

export function Sidebar({ balance }: SidebarProps) {
  return (
    <aside className="relative z-10 w-64 flex-shrink-0 hidden md:flex flex-col bg-card border-r border-border">
      <div className="px-6 pt-7 pb-4 flex items-center gap-2">
        <Heart className="w-5 h-5 fill-current flex-shrink-0 text-primary" />
        <span className="text-xl font-bold tracking-tight leading-none font-playfair text-primary">LoveSync</span>
      </div>
      <p className="px-6 text-[11px] -mt-3 mb-5 font-medium tracking-widest uppercase text-muted-foreground">
        O Hub do Casal
      </p>

      <div className="mx-4 mb-4 p-4 rounded-2xl bg-muted border border-border">
        <div className="flex items-center justify-center gap-4">
          {/* {[couple.user, couple.partner].map((profile, index) => (
            <div key={index} className="flex flex-col items-center gap-1">
              <img src={profile.avatar} alt={profile.name} className="w-11 h-11 rounded-full object-cover border-[2.5px] border-primary" />
              <span className="text-xs font-semibold">{profile.name}</span>
            </div>
          ))} */}
        </div>
        <div className="flex items-center justify-center gap-1.5 mt-3">
          <Heart className="w-3 h-3 fill-current text-primary" />
          <span className="text-[11px] text-muted-foreground">
            x dias juntos
          </span>
        </div>
      </div>

      <div className="mx-4 mb-6 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground">
        <Coins className="w-4 h-4 flex-shrink-0" />
        <span className="text-sm font-bold">{balance} Love Tokens</span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ path, label, Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm transition-all duration-150 ${isActive ? "bg-primary text-primary-foreground font-semibold" : "text-foreground"
              }`
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{label}</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-70" />
          </NavLink>
        ))}
      </nav>

      <p className="px-6 pb-6 pt-4 text-[10px] text-center leading-relaxed text-muted-foreground">
        Juntos desde<br />x
      </p>
    </aside>
  );
}
