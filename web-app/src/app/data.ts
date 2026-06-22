export type Module = "home" | "roleta" | "tokens" | "timeline";

export type SwipeOption = {
  id: number;
  label: string;
  emoji: string;
  desc: string;
  color: string;
  partnerVoted: boolean;
};

export type TaskStatus = "done" | "pending" | "approved";
export type Task = {
  id: number;
  label: string;
  tokens: number;
  status: TaskStatus;
  by: string;
};

export type StoreItem = {
  id: number;
  label: string;
  tokens: number;
  emoji: string;
};

export type LedgerEntryType = "credit" | "debit";
export type LedgerEntry = {
  id: number;
  desc: string;
  amount: number;
  date: string;
  type: LedgerEntryType;
};

export type Memory = {
  id: number;
  author: string;
  avatar: string;
  text: string;
  mood: string;
  location: string;
  date: string;
  image: string;
  likes: number;
};

export const couple = {
  user: {
    name: "Ana",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=80&h=80&fit=crop&auto=format",
  },
  partner: {
    name: "Bruno",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format",
  },
  since: "14 de Fevereiro, 2022",
  days: 872,
};

export const SWIPE_OPTIONS: SwipeOption[] = [
  {
    id: 1,
    label: "Jantar Italiano",
    emoji: "🍝",
    desc: "Restaurante Trattoria, 20h",
    color: "#fef3c7",
    partnerVoted: false,
  },
  {
    id: 2,
    label: "Sushi no Parque",
    emoji: "🍱",
    desc: "Rodízio no Parque Ibirapuera",
    color: "#e0f2fe",
    partnerVoted: true,
  },
  {
    id: 3,
    label: "Pizza em Casa",
    emoji: "🍕",
    desc: "Pedir delivery e maratonar série",
    color: "#fce7f3",
    partnerVoted: false,
  },
  {
    id: 4,
    label: "Hambúrguer Artesanal",
    emoji: "🍔",
    desc: "Nova hamburgueria do bairro",
    color: "#ecfdf5",
    partnerVoted: false,
  },
];

export const INITIAL_TASKS: Task[] = [
  { id: 1, label: "Lavar a louça", tokens: 15, status: "done", by: "Ana" },
  { id: 2, label: "Fazer as compras do mês", tokens: 25, status: "pending", by: "Bruno" },
  { id: 3, label: "Aspirar a sala", tokens: 20, status: "approved", by: "Ana" },
  { id: 4, label: "Preparar o jantar especial", tokens: 30, status: "pending", by: "Bruno" },
  { id: 5, label: "Regar as plantas", tokens: 10, status: "done", by: "Ana" },
];

export const STORE_ITEMS: StoreItem[] = [
  { id: 1, label: "Vale massagem 30 min", tokens: 50, emoji: "💆" },
  { id: 2, label: "Escolher o filme da noite", tokens: 20, emoji: "🎬" },
  { id: 3, label: "Café da manhã na cama", tokens: 75, emoji: "☕" },
  { id: 4, label: "Dia de folga das tarefas", tokens: 100, emoji: "🛋️" },
  { id: 5, label: "Jantar surpresa", tokens: 120, emoji: "🌹" },
  { id: 6, label: "Parque de diversões", tokens: 200, emoji: "🎢" },
];

export const INITIAL_LEDGER: LedgerEntry[] = [
  { id: 1, desc: "Aspirar a sala", amount: 20, date: "Hoje, 14h30", type: "credit" },
  { id: 2, desc: "Vale massagem", amount: -50, date: "Ontem, 20h15", type: "debit" },
  { id: 3, desc: "Fazer as compras", amount: 25, date: "19 Jun, 10h00", type: "credit" },
  { id: 4, desc: "Escolher o filme", amount: -20, date: "18 Jun, 21h00", type: "debit" },
  { id: 5, desc: "Lavar o banheiro", amount: 30, date: "17 Jun, 16h45", type: "credit" },
];

export const MEMORIES: Memory[] = [
  {
    id: 1,
    author: "Ana",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&auto=format",
    text: "Nosso primeiro pôr do sol em Florianópolis. Esse momento ficará para sempre no coração 🌅",
    mood: "💛 Feliz",
    location: "Florianópolis, SC",
    date: "15 Jun 2026",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&h=420&fit=crop&auto=format",
    likes: 2,
  },
  {
    id: 2,
    author: "Bruno",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&auto=format",
    text: "Aquela noite mágica no concerto ao ar livre. A Ana estava radiante ✨",
    mood: "🥰 Apaixonado",
    location: "São Paulo, SP",
    date: "02 Jun 2026",
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=700&h=420&fit=crop&auto=format",
    likes: 2,
  },
  {
    id: 3,
    author: "Ana",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&auto=format",
    text: "Trilha na Serra da Mantiqueira. Exaustiva mas valeu cada passo! 🏔️",
    mood: "💪 Aventureiro",
    location: "Serra da Mantiqueira",
    date: "18 Mai 2026",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=700&h=420&fit=crop&auto=format",
    likes: 1,
  },
];
