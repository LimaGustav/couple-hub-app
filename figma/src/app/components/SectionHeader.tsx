import type { ReactNode } from "react";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  containerClassName?: string;
};

export function SectionHeader({
  title,
  subtitle,
  action,
  containerClassName,
}: SectionHeaderProps) {
  return (
    <div className={`flex flex-col gap-3 md:flex-row md:items-center md:justify-between ${containerClassName ?? ""}`}>
      <div>
        <h2 className="text-base md:text-lg font-bold font-playfair">{title}</h2>
        {subtitle ? <p className="text-sm text-muted-foreground mt-1">{subtitle}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
