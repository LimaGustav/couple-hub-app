type ActionTileProps = {
  emoji: string;
  label: string;
  description: string;
  onClick: () => void;
};

export function ActionTile({ emoji, label, description, onClick }: ActionTileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="p-4 rounded-2xl text-left transition-all duration-150 hover:scale-[1.02] active:scale-[0.97] bg-card border border-border"
    >
      <div className="text-2xl mb-2">{emoji}</div>
      <p className="font-semibold text-sm">{label}</p>
      <p className="text-xs mt-0.5 text-muted-foreground">{description}</p>
    </button>
  );
}
