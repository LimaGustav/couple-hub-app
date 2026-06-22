import { Heart, Coins } from "lucide-react";
import { BrowserRouter } from "react-router-dom";
import { Sidebar, MemphisShapes, MobileNav } from "./components";
import { AppRoutes } from "./routes";
import { AppDataProvider, useAppData } from "./contexts/AppDataContext";
import { MEMORIES } from "./data";

function AppLayout() {
  const { balance, isAuthenticated } = useAppData();

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-background text-foreground overflow-hidden font-dm-sans">
        <AppRoutes memories={MEMORIES} />
      </main>
    );
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground overflow-hidden font-dm-sans">
      <MemphisShapes />
      <Sidebar balance={balance} />

      <main className="relative z-10 flex-1 overflow-y-auto pb-20 md:pb-0">
        <div className="md:hidden sticky top-0 z-20 flex items-center justify-between px-5 py-3 bg-card border-b border-border">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 fill-current text-primary" />
            <span className="text-base font-bold font-playfair text-primary">LoveSync</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-primary text-primary-foreground">
            <Coins className="w-3.5 h-3.5" />
            {balance}
          </div>
        </div>

        <AppRoutes memories={MEMORIES} />
      </main>

      <MobileNav />
    </div>
  );
}

export default function App() {
  return (
    <AppDataProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AppDataProvider>
  );
}
