import { createContext, useContext, useState, ReactNode } from "react";
import type { Task, LedgerEntry, StoreItem } from "../data";
import { INITIAL_TASKS, INITIAL_LEDGER } from "../data";

type AppDataContextType = {
  balance: number;
  tasks: Task[];
  ledger: LedgerEntry[];
  flashRedeem: number | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  approveTask: (id: number) => void;
  redeem: (item: StoreItem) => void;
  resetFlashRedeem: () => void;
};

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(340);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [ledger, setLedger] = useState(INITIAL_LEDGER);
  const [flashRedeem, setFlashRedeem] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const approveTask = (id: number) => {
    const task = tasks.find((current) => current.id === id && current.status === "pending");
    if (!task) return;

    setTasks((prev) =>
      prev.map((current) =>
        current.id === id ? { ...current, status: "approved" } : current
      )
    );
    setBalance((current) => current + task.tokens);
    setLedger((current) => [
      { id: Date.now(), desc: task.label, amount: task.tokens, date: "Agora", type: "credit" },
      ...current,
    ]);
  };

  const redeem = (item: StoreItem) => {
    if (balance < item.tokens) return;
    setBalance((current) => current - item.tokens);
    setLedger((current) => [
      { id: Date.now(), desc: item.label, amount: -item.tokens, date: "Agora", type: "debit" },
      ...current,
    ]);
    setFlashRedeem(item.id);
    setTimeout(() => setFlashRedeem(null), 2000);
  };

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const resetFlashRedeem = () => {
    setFlashRedeem(null);
  };

  return (
    <AppDataContext.Provider
      value={{
        balance,
        tasks,
        ledger,
        flashRedeem,
        isAuthenticated,
        login,
        logout,
        approveTask,
        redeem,
        resetFlashRedeem,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used within AppDataProvider");
  }
  return context;
}
