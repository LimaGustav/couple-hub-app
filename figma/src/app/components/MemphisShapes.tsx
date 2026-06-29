export function MemphisShapes() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-[0.08] bg-primary" />
      <div className="absolute bottom-24 -left-10 w-52 h-52 rounded-full opacity-[0.06] bg-accent" />
      <div className="absolute top-[42%] -right-8 w-24 h-24 rotate-[28deg] opacity-[0.07] bg-primary" />
      <svg className="absolute bottom-12 right-[18%] opacity-[0.07]" width="110" height="110" viewBox="0 0 110 110">
        <polygon points="55,8 104,96 6,96" fill="var(--primary)" />
      </svg>
      <div className="absolute top-[14%] left-[3%] w-10 h-10 rotate-12 opacity-[0.12] rounded bg-accent" />
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute w-3 h-3 rounded-full opacity-20 bg-primary"
          style={{ top: `${28 + i * 14}%`, left: `${87 + (i % 2) * 4}%` }}
        />
      ))}
    </div>
  );
}
