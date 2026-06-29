import { ChevronRight, Check, Coins, Heart, MapPin, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ActionTile, MetricCard, SectionHeader } from "../../../shared/components"


export function HomePage() {
    const navigate = useNavigate();

    const actions = [
        { label: "Abrir votação", description: "Decida algo juntos", emoji: "🎲", path: "/roleta" },
        { label: "Registrar tarefa", description: "Ganhe Love Tokens", emoji: "✅", path: "/tokens" },
        { label: "Resgatar cupom", description: "Use seus tokens", emoji: "🎁", path: "/tokens" },
        { label: "Postar memória", description: "Eternize um momento", emoji: "📸", path: "/timeline" },
    ];

    return (
        <div className="p-5 md:p-8 max-w-4xl mx-auto">
            <div className="mb-6 md:mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-1 leading-tight font-playfair">Bom dia, Leticia! 👋</h1>
                <p className="text-sm text-muted-foreground">Data atual</p>
            </div>

            <div className="md:hidden flex items-center gap-3 p-4 rounded-2xl mb-5 border border-border bg-muted text-muted-foreground">
                <div className="flex items-center gap-2">
                    {/* {[couple.user, couple.partner].map((profile, index) => (
                        <img
                            key={index}
                            src={profile.avatar}
                            alt={profile.name}
                            className="w-9 h-9 rounded-full object-cover border-[2px] border-primary -ml-1 first:ml-0"
                        />
                    ))} */}
                </div>
                <div>
                    <p className="text-sm font-semibold">Ana & Bruno</p>
                    <p className="text-[11px] text-muted-foreground">x dias juntos ❤️</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
                {/* {metrics.map(({ label, value, Icon, accentClass, bgClass }) => (
                    <MetricCard key={label} label={label} value={value} Icon={Icon} accentClass={accentClass} bgClass={bgClass} />
                ))} */}
            </div>

            <div className="mb-6 md:mb-8">
                <SectionHeader
                    title="Última memória"
                    subtitle="Reviva um momento especial juntos"
                    action={
                        <button
                            onClick={() => navigate("/timeline")}
                            className="text-xs font-semibold flex items-center gap-1 text-primary"
                        >
                            Ver todas <ChevronRight className="w-3 h-3" />
                        </button>
                    }
                />

                <div className="mt-4 rounded-2xl overflow-hidden bg-card border border-border">
                    <div className="relative h-44 md:h-52 bg-muted">
                        <img className="w-full h-full object-cover" />
                        <div className="absolute inset-0 gradient-fade-top" />
                        <div className="absolute bottom-0 left-0 p-4 text-white">
                            <p className="text-sm font-medium leading-snug">

                            </p>
                            <div className="flex items-center gap-1.5 mt-1 text-xs opacity-75">
                                <MapPin className="w-3 h-3" />
                                <span>

                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <SectionHeader title="Ações rápidas" subtitle="Inicie algo novo em segundos" />
                <div className="grid grid-cols-2 gap-3 mt-3">
                    {actions.map((action) => (
                        <ActionTile
                            key={action.label}
                            emoji={action.emoji}
                            label={action.label}
                            description={action.description}
                            onClick={() => navigate(action.path)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
