import type { LucideIcon } from "lucide-react";

type MetricCardProps = {
  label: string;
  value: number | string;
  Icon: LucideIcon;
  accentClass: string;
  bgClass: string;
};

export function MetricCard({ label, value, Icon, accentClass, bgClass }: MetricCardProps) {
  return (
    <div className={`rounded-2xl p-4 md:p-5 border border-border ${bgClass}`}>
      <div className="flex items-center gap-1.5 md:gap-2 mb-3">
        <div className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${accentClass}`}>
          <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
        </div>
      </div>
      <p className="text-3xl md:text-4xl font-bold leading-none">{value}</p>
      <p className="text-[10px] md:text-xs mt-1 leading-tight text-muted-foreground">{label}</p>
    </div>
  );
}
