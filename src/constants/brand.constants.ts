export const BRAND = {
  red: '#8B1A2E',
  redDark: '#6e1424',
  redHover: '#a01828',
  redDeep: '#C41E3A',
  redBg: '#FFF1F2',
  redBorder: '#FECDD3',
  redLight: '#FFE4E8',
  dark: '#8A0303',
  navy: '#1C1C2E',
} as const;

export const SURFACE = {
  page: '#F8F9FA',
  card: '#ffffff',
  border: '#E5E7EB',
  rowHeader: '#F9FAFB',
  muted: '#F3F4F6',
} as const;

export const STATUS_COLORS = {
  active: { color: '#15803D', bg: '#DCFCE7', border: '#BBF7D0' },
  inactive: { color: '#6B7280', bg: '#F3F4F6', border: '#E5E7EB' },
  completed: { color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' },
  in_progress: { color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
  assigned: { color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
  success: { color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' },
  warning: { color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
  info: { color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
} as const;

export const ACCENT_COLORS = {
  blue: '#2563EB',
  green: '#16A34A',
  amber: '#D97706',
  red: '#C41E3A',
} as const;

export const BENCH_STATUS_CONFIG: Record<string, { color: string; bg: string }> = {
  'On Bench': { color: '#C41E3A', bg: '#FFF1F2' },
  'Shadowing': { color: '#D97706', bg: '#FFFBEB' },
  'On Project': { color: '#16A34A', bg: '#F0FDF4' },
};

export const BENCH_STATUS_MAP: Record<string, string> = {
  'On Bench': 'on_bench',
  'Shadowing': 'shadowing',
  'On Project': 'on_project',
};

export const BENCH_STATUS_DISPLAY_MAP: Record<string, string> = {
  on_bench: 'On Bench',
  shadowing: 'Shadowing',
  on_project: 'On Project',
};
