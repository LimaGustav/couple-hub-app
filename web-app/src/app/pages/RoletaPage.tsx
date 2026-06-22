import { AnimatePresence, motion } from "motion/react";
import { Heart, X } from "lucide-react";
import { SwipeCard } from "../components/SwipeCard";
import { couple, SWIPE_OPTIONS } from "../data";
import type { SwipeOption } from "../data";

type RoletaPageProps = {
  sessionActive: boolean;
  swipeQueue: SwipeOption[];
  votes: { id: number; dir: "left" | "right" }[];
  matchResult: SwipeOption | null;
  onStart: () => void;
  onSwipe: (dir: "left" | "right", id: number) => void;
};

export function RoletaPage({ sessionActive, swipeQueue, votes, matchResult, onStart, onSwipe }: RoletaPageProps) {
  const hasMatchVote = votes.some(
    (vote) => vote.dir === "right" && SWIPE_OPTIONS.find((option) => option.id === vote.id)?.partnerVoted
  );

  return (
    <div className="p-5 md:p-8 max-w-xl mx-auto">
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-1 leading-tight font-playfair">A Roleta 🎲</h1>
        <p className="text-sm text-muted-foreground">Arraste os cards — direita para votar, esquerda para passar</p>
      </div>

      {!sessionActive ? (
        <div className="rounded-2xl p-10 text-center bg-card border border-border">
          <div className="text-6xl mb-5">🎡</div>
          <h2 className="text-xl font-bold mb-2 font-playfair">Nenhuma sessão ativa</h2>
          <p className="text-sm mb-6 max-w-xs mx-auto leading-relaxed text-muted-foreground">
            Abra uma sessão para votar em opções de jantar com arraste de cards em tempo real.
          </p>
          <button className="px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105 active:scale-95 text-primary" onClick={onStart}>
            Abrir sessão — Jantar de Sexta
          </button>
        </div>
      ) : matchResult ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl p-10 text-center bg-card border-[2.5px] border-primary"
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-6xl mb-4"
          >
            🎉
          </motion.div>
          <h2 className="text-2xl font-bold mb-1 font-playfair">
            {hasMatchVote ? "Match encontrado!" : "Decisão tomada!"}
          </h2>
          <p className="text-sm mb-5 text-muted-foreground">
            {hasMatchVote ? "Vocês dois votaram na mesma opção" : "Resultado por desempate ponderado"}
          </p>
          <div className="text-5xl mb-3">{matchResult.emoji}</div>
          <div className="inline-block px-6 py-3 rounded-2xl text-lg font-bold mb-6 text-primary">
            {matchResult.label}
          </div>
          <br />
          <button className="text-sm px-4 py-2 rounded-xl font-medium transition-all hover:opacity-80 bg-muted text-muted-foreground" onClick={onStart}>
            Nova sessão
          </button>
        </motion.div>
      ) : (
        <div>
          <div className="rounded-2xl p-3.5 mb-6 flex items-center justify-between bg-card border border-border">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-semibold text-green-600">Sessão ao vivo</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground">
                ⏱ 28:41
              </span>
              <span className="text-xs text-muted-foreground">{swipeQueue.length} restantes</span>
            </div>
          </div>

          <div className="relative h-[360px]">
            <AnimatePresence>
              {swipeQueue.map((option, index) => (
                <SwipeCard
                  key={option.id}
                  option={option}
                  index={index}
                  total={swipeQueue.length}
                  isTop={index === swipeQueue.length - 1}
                  onSwipe={onSwipe}
                />
              ))}
            </AnimatePresence>
            {swipeQueue.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
                Calculando resultado...
              </div>
            )}
          </div>

          {swipeQueue.length > 0 && (
            <div className="flex items-center justify-center gap-6 mt-6">
              <button
                onClick={() => {
                  const top = swipeQueue[swipeQueue.length - 1];
                  if (top) onSwipe("left", top.id);
                }}
                className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 bg-[#fee2e2] border-2 border-[#fca5a5]"
              >
                <X className="w-6 h-6 text-[#dc2626]" />
              </button>
              <div className="text-xs text-center text-muted-foreground">
                <p>Arraste ou use</p>
                <p>os botões</p>
              </div>
              <button
                onClick={() => {
                  const top = swipeQueue[swipeQueue.length - 1];
                  if (top) onSwipe("right", top.id);
                }}
                className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 bg-[#dcfce7] border-2 border-[#86efac]"
              >
                <Heart className="w-6 h-6 fill-current text-[#16a34a]" />
              </button>
            </div>
          )}

          <div className="mt-6 rounded-xl p-3 flex items-center gap-3 bg-muted">
            <img
              src={couple.partner.avatar}
              alt={couple.partner.name}
              className="w-8 h-8 rounded-full object-cover border-[2px] border-primary"
            />
            <div>
              <p className="text-xs font-semibold">Bruno está votando</p>
              <p className="text-[10px] text-muted-foreground">Votou em 🍱 Sushi no Parque</p>
            </div>
            <div className="ml-auto w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
}
