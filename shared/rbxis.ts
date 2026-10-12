export const PLAN_CATALOG = [
  { id: "hourly", name: "1 hora", description: "Acesso por 1 hora após a ativação", accent: "gray" },
  { id: "daily", name: "1 dia", description: "Acesso diário", accent: "gray" },
  { id: "weekly", name: "1 semana", description: "Acesso semanal", accent: "blue" },
  { id: "monthly", name: "1 mês", description: "30 dias após a ativação", accent: "blue" },
  { id: "perm", name: "Permanente", description: "Acesso sem expiração", accent: "gold" },
] as const;

export const OPERATING_SYSTEMS = ["android", "ios"] as const;
export const PERFORMANCE_LEVELS = ["low", "medium", "high"] as const;
export const DURATION_UNITS = ["hours", "days", "weeks", "months", "years"] as const;
export type DurationUnit = (typeof DURATION_UNITS)[number];

/** MockAPI stores hourly expiry in hours and all other temporary plans in days. A month is 30 days. */
export function durationInDays(value: number, unit: DurationUnit) {
  if (unit === "hours") return value / 24;
  if (unit === "days") return value;
  if (unit === "weeks") return value * 7;
  if (unit === "months") return value * 30;
  return value * 365;
}

export function storedExpiryForPlan(planId: string, value: number, unit: DurationUnit) {
  if (planId === "perm") return 0;
  if (planId === "hourly") return value;
  return durationInDays(value, unit);
}

export function durationFromStoredExpiry(type: string, expire: number): { value: number; unit: DurationUnit } {
  const amount = Math.max(0, Number(expire) || 0);
  if (type === "perm") return { value: 0, unit: "days" };
  if (type === "hourly") return { value: amount, unit: "hours" };
  if (type === "weekly") return { value: Math.max(1, Math.round(amount / 7)), unit: "weeks" };
  if (type === "monthly") return { value: Math.max(1, Math.round(amount / 30)), unit: "months" };
  if (type === "yearly") return { value: Math.max(1, Math.round(amount / 365)), unit: "years" };
  return { value: amount, unit: "days" };
}

/** Returns a MockAPI expiresAt Unix timestamp; hourly licenses last exactly one hour from first activation. */
export function activationExpirySeconds(type: string, expire: number, activatedAt: number) {
  if (type === "perm") return 0;
  const secondsPerUnit = type === "hourly" ? 60 * 60 : 24 * 60 * 60;
  return activatedAt + Math.max(1, Number(expire) || 1) * secondsPerUnit;
}

export type RbxisRole = "admin" | "user";
export type RbxisSession = {
  role: RbxisRole;
  userId?: number;
  licenseId?: number;
  username?: string;
  expiresAt: number;
};

export type SensitivityValues = {
  general: number;
  redDot: number;
  scope2x: number;
  scope4x: number;
  awm: number;
};

export const PERFORMANCE_LABELS: Record<(typeof PERFORMANCE_LEVELS)[number], string> = {
  low: "Baixo",
  medium: "Médio",
  high: "Alto",
};

export const OS_LABELS: Record<(typeof OPERATING_SYSTEMS)[number], string> = {
  android: "Android",
  ios: "iOS",
};

export function planName(planId: string) {
  return PLAN_CATALOG.find(plan => plan.id === planId)?.name ?? planId;
}
