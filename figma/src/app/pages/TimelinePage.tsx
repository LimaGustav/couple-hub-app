import { Heart, MapPin, MessageCircle, Plus, Star } from "lucide-react";
import { useState } from "react";
import type { Memory } from "../data";

type TimelinePageProps = {
  memories: Memory[];
};

export function TimelinePage({ memories }: TimelinePageProps) {
  const [liked, setLiked] = useState<Set<number>>(new Set());

  function toggleLike(id: number) {
    setLiked((current) => {
      const next = new Set(current);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto">
      <div className="mb-6 md:mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-1 leading-tight font-playfair">Timeline 📸</h1>
          <p className="text-sm text-muted-foreground">A cápsula do tempo do casal</p>
        </div>
        <button className="flex items-center gap-2 px-3 md:px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all hover:scale-105 active:scale-95 flex-shrink-0 text-primary">
          <Plus className="w-4 h-4" />
          <span className="hidden md:inline">Nova memória</span>
          <span className="md:hidden">Postar</span>
        </button>
      </div>

      <div className="space-y-5 md:space-y-6">
        {memories.map((memory) => {
          const isLiked = liked.has(memory.id);
          return (
            <div key={memory.id} className="rounded-2xl overflow-hidden bg-card border border-border">
              <div className="px-4 pt-4 pb-3 flex items-center gap-3">
                <img
                  src={memory.avatar}
                  alt={memory.author}
                  className="w-9 h-9 rounded-full object-cover flex-shrink-0 border-[2px] border-primary"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{memory.author}</p>
                  <div className="flex items-center gap-1.5 text-[11px] mt-0.5 text-muted-foreground">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{memory.location} · {memory.date}</span>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 bg-muted text-muted-foreground">
                  {memory.mood}
                </span>
              </div>

              <div className="relative h-52 md:h-56 bg-muted">
                <img src={memory.image} alt={memory.text} className="w-full h-full object-cover" />
              </div>

              <div className="px-4 pt-3 pb-4">
                <p className="text-sm leading-relaxed">{memory.text}</p>
                <div className="flex items-center gap-4 mt-3">
                  <button
                    onClick={() => toggleLike(memory.id)}
                    className={`flex items-center gap-1.5 text-xs font-medium transition-all hover:scale-110 active:scale-95 ${
                      isLiked ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <Heart className="w-4 h-4" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" />
                    {memory.likes + (isLiked ? 1 : 0)}
                  </button>
                  <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <MessageCircle className="w-4 h-4" /> Comentar
                  </button>
                  <button className="flex items-center gap-1.5 text-xs font-medium ml-auto text-muted-foreground">
                    <Star className="w-4 h-4" /> Favoritar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
