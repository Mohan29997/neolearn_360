import { BRAND, SURFACE } from '../../../constants/brand.constants';

export const statCardStyles = {
  card: (accent: string) => ({
    bgcolor: SURFACE.card,
    border: `1px solid ${SURFACE.border}`,
    borderRadius: '12px',
    p: 2.5,
    position: 'relative',
    overflow: 'hidden',
    borderTop: `3px solid ${accent}`,
  }),
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  iconBox: (accent: string) => ({
    width: 36,
    height: 36,
    borderRadius: '8px',
    bgcolor: `${accent}15`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: accent,
  }),
  stableChip: { bgcolor: '#F0FDF4', color: '#16A34A', fontWeight: 700, fontSize: 10 },
  upBadge: { display: 'flex', alignItems: 'center', gap: 0.3, color: '#16A34A' },
  downBadge: { display: 'flex', alignItems: 'center', gap: 0.3, color: '#D97706' },
  label: { fontSize: 10, fontWeight: 700, color: 'grey.500', letterSpacing: '0.5px', mt: 1.5, mb: 0.5 },
  value: { fontSize: 28, fontWeight: 800, color: 'grey.900' },
} as const;

export const benchStatBoxStyles = {
  box: (highlight: boolean) => ({
    p: 1.5,
    borderRadius: '8px',
    bgcolor: highlight ? BRAND.redBg : SURFACE.muted,
    border: `1px solid ${highlight ? BRAND.redBorder : SURFACE.muted}`,
  }),
  label: (highlight: boolean) => ({
    fontSize: 9,
    fontWeight: 700,
    color: highlight ? BRAND.red : 'grey.500',
    letterSpacing: '0.4px',
    mb: 0.5,
  }),
  value: (highlight: boolean) => ({
    fontSize: 18,
    fontWeight: 800,
    color: highlight ? BRAND.red : 'grey.800',
  }),
  subLabel: { fontSize: 10, color: 'grey.400' },
} as const;

export const quickActionStyles = {
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    p: 1.5,
    borderRadius: '10px',
    border: `1px solid ${SURFACE.muted}`,
    cursor: 'pointer',
    transition: 'all 0.15s',
    '&:hover': { bgcolor: BRAND.redBg, borderColor: BRAND.redBorder },
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: '8px',
    bgcolor: BRAND.redBg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  title: { fontSize: 13.5, fontWeight: 700, color: 'grey.900' },
  sub: { fontSize: 11.5, color: 'grey.500' },
} as const;

export const fabStyles = {
  root: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    width: 48,
    height: 48,
    bgcolor: BRAND.red,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 14px rgba(139,26,46,0.4)',
    cursor: 'pointer',
    zIndex: 999,
  },
} as const;
