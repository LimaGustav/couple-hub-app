import { ArrowDownRight, ArrowUpRight, Check, Coins, Plus } from "lucide-react";
import { useState } from "react";
import { useAppData } from "../contexts/AppDataContext";
import { STORE_ITEMS } from "../data";

export function TokensPage() {
  const [tab, setTab] = useState<"tasks" | "store" | "ledger">("tasks");
  const { balance, tasks, ledger, flashRedeem, approveTask, redeem } = useAppData();

  return (
    <div className="p-5 md:p-8 max-w-3xl mx-auto">
      <div className="mb-5 md:mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-1 leading-tight font-playfair">Love Tokens 💰</h1>
        <div className="inline-flex items-center gap-2 mt-3 px-4 py-2.5 rounded-xl font-bold text-sm md:text-base text-primary">
          <Coins className="w-4 h-4" />
          {balance} tokens disponíveis
        </div>
      </div>

      <div className="flex gap-2 mb-5">
        {(["tasks", "store", "ledger"] as const).map((option) => (
          <button
            key={option}
            onClick={() => setTab(option)}
            className={`px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition-all ${
              tab === option ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {option === "tasks" ? "Tarefas" : option === "store" ? "Loja" : "Extrato"}
          </button>
        ))}
      </div>

      {tab === "tasks" && (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="p-4 rounded-2xl flex items-center justify-between gap-3 bg-card border border-border">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{task.label}</p>
                <p className="text-xs mt-0.5 text-muted-foreground">
                  {task.by} · <span className="font-semibold text-primary">+{task.tokens}</span>
                </p>
              </div>
              {task.status === "approved" && (
                <span className="text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 bg-[#dcfce7] text-[#16a34a]">
                  ✓ Aprovado
                </span>
              )}
              {task.status === "done" && (
                <span className="text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 bg-[#fef9c3] text-[#a16207]">
                  Concluído
                </span>
              )}
              {task.status === "pending" && (
                <button
                  onClick={() => approveTask(task.id)}
                  className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 flex-shrink-0 bg-primary text-primary-foreground"
                >
                  Aprovar
                </button>
              )}
            </div>
          ))}
          <button className="w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 bg-muted text-muted-foreground">
            <Plus className="w-4 h-4" /> Lançar nova tarefa
          </button>
        </div>
      )}

      {tab === "store" && (
        <div className="grid grid-cols-2 gap-3">
          {STORE_ITEMS.map((item) => {
            const canAfford = balance >= item.tokens;
            const done = flashRedeem === item.id;
            return (
              <div key={item.id} className="p-4 rounded-2xl flex flex-col bg-card border border-border">
                <div className="text-3xl mb-2">{item.emoji}</div>
                <p className="font-semibold text-sm flex-1 leading-snug mb-3">{item.label}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-bold ${canAfford ? "text-primary" : "text-muted-foreground"}`}>
                    {item.tokens}
                  </span>
                  <button
                    onClick={() => redeem(item)}
                    disabled={!canAfford}
                    className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
                      done ? "bg-[#22c55e] text-white" : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {done ? "✓ Resgatado" : "Resgatar"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "ledger" && (
        <div className="space-y-2">
          {ledger.map((entry) => (
            <div key={entry.id} className="px-4 py-3 rounded-xl flex items-center justify-between gap-3 bg-card border border-border">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  entry.type === "credit" ? "bg-[#dcfce7]" : "bg-[#fee2e2]"
                }`}>
                  {entry.type === "credit" ? (
                    <ArrowUpRight className="w-4 h-4 text-[#16a34a]" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-[#dc2626]" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{entry.desc}</p>
                  <p className="text-xs mt-0.5 text-muted-foreground">{entry.date}</p>
                </div>
              </div>
              <span
                className={`font-bold text-sm flex-shrink-0 font-dm-mono ${
                  entry.type === "credit" ? "text-[#16a34a]" : "text-[#dc2626]"
                }`}
              >
                {entry.type === "credit" ? "+" : ""}{entry.amount}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
