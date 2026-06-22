import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { RoletaPage } from "../pages/RoletaPage";
import { TokensPage } from "../pages/TokensPage";
import { TimelinePage } from "../pages/TimelinePage";
import type { LedgerEntry, Memory, StoreItem, SwipeOption, Task } from "../data";

export type Vote = { id: number; dir: "left" | "right" };

type AppRoutesProps = {
  balance: number;
  tasks: Task[];
  store: StoreItem[];
  ledger: LedgerEntry[];
  flashRedeem: number | null;
  sessionActive: boolean;
  swipeQueue: SwipeOption[];
  votes: Vote[];
  matchResult: SwipeOption | null;
  onStart: () => void;
  onSwipe: (dir: "left" | "right", id: number) => void;
  onApprove: (id: number) => void;
  onRedeem: (item: StoreItem) => void;
  memories: Memory[];
};

export function AppRoutes({
  balance,
  tasks,
  store,
  ledger,
  flashRedeem,
  sessionActive,
  swipeQueue,
  votes,
  matchResult,
  onStart,
  onSwipe,
  onApprove,
  onRedeem,
  memories,
}: AppRoutesProps) {
  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage balance={balance} tasks={tasks} memories={memories} />}
      />
      <Route
        path="/roleta"
        element={
          <RoletaPage
            sessionActive={sessionActive}
            swipeQueue={swipeQueue}
            votes={votes}
            matchResult={matchResult}
            onStart={onStart}
            onSwipe={onSwipe}
          />
        }
      />
      <Route
        path="/tokens"
        element={
          <TokensPage
            balance={balance}
            tasks={tasks}
            store={store}
            ledger={ledger}
            flashRedeem={flashRedeem}
            onApprove={onApprove}
            onRedeem={onRedeem}
          />
        }
      />
      <Route path="/timeline" element={<TimelinePage memories={memories} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
