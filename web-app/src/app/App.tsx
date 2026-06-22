import { useState } from "react";
import { Heart, Coins } from "lucide-react";
import { BrowserRouter } from "react-router-dom";
import { Sidebar, MemphisShapes, MobileNav } from "./components";
import { AppRoutes } from "./routes";
import {
  SWIPE_OPTIONS,
  INITIAL_TASKS,
  STORE_ITEMS,
  INITIAL_LEDGER,
  MEMORIES,
} from "./data";

type Vote = { id: number; dir: "left" | "right" };

export default function App() {
  const [sessionActive, setSessionActive] = useState(false);
  const [swipeQueue, setSwipeQueue] = useState(SWIPE_OPTIONS);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [matchResult, setMatchResult] = useState<typeof SWIPE_OPTIONS[number] | null>(null);

  const [balance, setBalance] = useState(340);
  const [ledger, setLedger] = useState(INITIAL_LEDGER);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [flashRedeem, setFlashRedeem] = useState<number | null>(null);

  function startSession() {
    setSessionActive(true);
    setMatchResult(null);
    setSwipeQueue(SWIPE_OPTIONS);
    setVotes([]);
  }

  function handleSwipe(dir: "left" | "right", id: number) {
    const option = swipeQueue.find((item) => item.id === id);
    const nextVotes = [...votes, { id, dir }];
    setVotes(nextVotes);

    if (dir === "right" && option?.partnerVoted) {
      setTimeout(() => setMatchResult(option), 300);
      setSwipeQueue([]);
      return;
    }

    const remaining = swipeQueue.filter((item) => item.id !== id);
    setSwipeQueue(remaining);

    if (remaining.length === 0) {
      const rightVotes = nextVotes.filter((vote) => vote.dir === "right");
      const pick = rightVotes.length > 0
        ? SWIPE_OPTIONS.find((item) => item.id === rightVotes[Math.floor(Math.random() * rightVotes.length)].id)!
        : SWIPE_OPTIONS[Math.floor(Math.random() * SWIPE_OPTIONS.length)];
      setTimeout(() => setMatchResult(pick), 400);
    }
  }

  function approveTask(id: number) {
    const task = tasks.find((current) => current.id === id && current.status === "pending");
    if (!task) return;

    setTasks((prev) => prev.map((current) =>
      current.id === id ? { ...current, status: "approved" } : current
    ));
    setBalance((current) => current + task.tokens);
    setLedger((current) => [
      { id: Date.now(), desc: task.label, amount: task.tokens, date: "Agora", type: "credit" },
      ...current,
    ]);
  }

  function redeem(item: typeof STORE_ITEMS[number]) {
    if (balance < item.tokens) return;
    setBalance((current) => current - item.tokens);
    setLedger((current) => [
      { id: Date.now(), desc: item.label, amount: -item.tokens, date: "Agora", type: "debit" },
      ...current,
    ]);
    setFlashRedeem(item.id);
    setTimeout(() => setFlashRedeem(null), 2000);
  }

  return (
    <BrowserRouter>
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

          <AppRoutes
            balance={balance}
            tasks={tasks}
            store={STORE_ITEMS}
            ledger={ledger}
            flashRedeem={flashRedeem}
            sessionActive={sessionActive}
            swipeQueue={swipeQueue}
            votes={votes}
            matchResult={matchResult}
            onStart={startSession}
            onSwipe={handleSwipe}
            onApprove={approveTask}
            onRedeem={redeem}
            memories={MEMORIES}
          />
        </main>

        <MobileNav />
      </div>
    </BrowserRouter>
  );
}
