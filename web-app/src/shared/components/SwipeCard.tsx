import { motion, useMotionValue, useTransform } from "motion/react";
import { Heart } from "lucide-react";
import type { SwipeOption } from "../data";

type SwipeCardProps = {
  option: SwipeOption;
  index: number;
  total: number;
  isTop: boolean;
  onSwipe: (dir: "left" | "right", id: number) => void;
};

export function SwipeCard({ option, index, total, isTop, onSwipe }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-18, 18]);
  const yesOpacity = useTransform(x, [30, 110], [0, 1]);
  const nopeOpacity = useTransform(x, [-110, -30], [1, 0]);
  const cardOpacity = useTransform(x, [-220, -160, 0, 160, 220], [0, 1, 1, 1, 0]);

  const depth = total - 1 - index;
  const scale = 1 - depth * 0.04;
  const yOffset = depth * 10;

  function handleDragEnd(_: unknown, info: { offset: { x: number }; velocity: { x: number } }) {
    const threshold = 100;
    const velThreshold = 400;
    if (info.offset.x > threshold || info.velocity.x > velThreshold) {
      onSwipe("right", option.id);
    } else if (info.offset.x < -threshold || info.velocity.x < -velThreshold) {
      onSwipe("left", option.id);
    }
  }

  return (
    <motion.div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: index }} initial={false}>
      <motion.div
        style={{
          x: isTop ? x : 0,
          rotate: isTop ? rotate : 0,
          opacity: isTop ? cardOpacity : 1,
          scale,
          y: yOffset,
          transformOrigin: "bottom center",
        }}
        drag={isTop ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.9}
        onDragEnd={handleDragEnd}
        className="w-full max-w-xs cursor-grab active:cursor-grabbing select-none"
        whileDrag={{ scale: 1.03 }}
      >
        <div className="rounded-3xl overflow-hidden shadow-xl border-[2px] border-border min-h-[320px]" style={{ background: option.color }}>
          <div className="relative">
            {isTop && (
              <>
                <motion.div style={{ opacity: yesOpacity }} className="absolute top-5 left-5 z-10 px-3 py-1.5 rounded-xl border-2 border-green-500 -rotate-12">
                  <span className="text-green-600 font-black text-lg tracking-wide">SIM ✓</span>
                </motion.div>
                <motion.div style={{ opacity: nopeOpacity }} className="absolute top-5 right-5 z-10 px-3 py-1.5 rounded-xl border-2 border-red-400 rotate-12">
                  <span className="text-red-500 font-black text-lg tracking-wide">NÃO ✗</span>
                </motion.div>
              </>
            )}
          </div>

          <div className="flex flex-col items-center justify-center px-8 py-12 text-center gap-3">
            <div className="text-7xl">{option.emoji}</div>
            <h3 className="text-2xl font-bold mt-2 leading-tight font-playfair text-foreground">{option.label}</h3>
            <p className="text-sm text-muted-foreground">{option.desc}</p>

            {option.partnerVoted && (
              <div className="flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                <Heart className="w-3 h-3 fill-current" />
                Bruno já votou aqui!
              </div>
            )}
          </div>

          {isTop && (
            <div className="px-8 pb-6 flex justify-between text-[11px] font-semibold text-muted-foreground">
              <span>← Não quero</span>
              <span>Quero! →</span>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
