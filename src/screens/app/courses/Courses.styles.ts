import { BRAND, SURFACE } from '../../../constants/brand.constants';

const B = SURFACE.border;

export const coursesStyles = {
  addBtn: {
    bgcolor: BRAND.red, color: '#fff', textTransform: 'none', fontWeight: 700,
    borderRadius: '10px', px: 2.5, py: 1, fontSize: 13.5, boxShadow: 'none',
    width: 'fit-content', flexShrink: 0, alignSelf: 'center',
    transition: 'all 0.2s',
    '&:hover': { bgcolor: BRAND.redHover, transform: 'translateY(-1px)', boxShadow: `0 6px 20px rgba(139,26,46,0.28)` },
    '&:active': { transform: 'translateY(0)' },
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, 1fr)' },
    gap: 1.5,
    mb: 3,
  },
  statCard: (accent: string) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 1.4,
    p: 2,
    borderRadius: '14px',
    border: `1.5px solid ${B}`,
    bgcolor: '#fff',
    transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
    '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 8px 24px ${accent}22`, borderColor: accent },
  }),
  statIconBox: (accent: string) => ({
    width: 40,
    height: 40,
    borderRadius: '10px',
    bgcolor: `${accent}18`,
    color: accent,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  }),
  statValue: { fontWeight: 800, fontSize: 20, color: 'grey.900', lineHeight: 1.2 },
  statLabel: { fontSize: 11.5, fontWeight: 600, color: 'grey.500' },
  tableRow: {
    transition: 'background-color 0.16s',
    '&:hover': { bgcolor: BRAND.redBg },
    '&:last-child td, &:last-child th': { border: 0 },
    '@keyframes rowIn': { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
  },
  levelChip: (level: string) => {
    const map: Record<string, { bg: string; color: string }> = {
      beginner: { bg: '#F0FDF4', color: '#16A34A' },
      intermediate: { bg: '#FFFBEB', color: '#D97706' },
      advanced: { bg: '#FEF2F2', color: '#DC2626' },
    };
    const c = map[level?.toLowerCase()] || { bg: '#F3F4F6', color: '#6B7280' };
    return { fontSize: 11, fontWeight: 700, borderRadius: '6px', bgcolor: c.bg, color: c.color, textTransform: 'capitalize' };
  },
  dialogClose: {
    position: 'absolute',
    right: 8,
    top: 8,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    transition: 'all 0.18s',
    '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)', transform: 'rotate(90deg)' },
  },
  urlBtn: {
    fontSize: 12,
    textTransform: 'none',
    borderRadius: '6px',
    borderColor: BRAND.redBorder,
    color: BRAND.red,
    fontWeight: 600,
    transition: 'all 0.18s',
    '&:hover': { borderColor: BRAND.red, bgcolor: BRAND.redBg, transform: 'translateY(-1px)' },
  },
  noUrlText: { fontSize: 13, color: 'grey.400' },
  descriptionCell: { maxWidth: 200 },
  descriptionText: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
  },
  activeChip: {
    fontSize: 11,
    fontWeight: 700,
    borderRadius: '6px',
    bgcolor: '#DCFCE7',
    color: '#15803D',
  },
  inactiveChip: {
    fontSize: 11,
    fontWeight: 700,
    borderRadius: '6px',
    bgcolor: '#F3F4F6',
    color: '#6B7280',
  },
  deleteBtn: {
    color: 'error.main',
    transition: 'all 0.18s',
    '&:hover': { bgcolor: '#FEF2F2', transform: 'scale(1.1)' },
  },
  tooltipProps: {
    tooltip: { sx: { bgcolor: 'grey.900', color: '#fff', fontSize: '13px', p: 1 } },
    arrow: { sx: { color: 'grey.900' } },
  },
  emptyState: {
    p: { xs: 5, sm: 8 },
    textAlign: 'center',
    background: `linear-gradient(145deg, ${BRAND.redBg} 0%, #fff 55%)`,
    '@keyframes fadeUp': { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
    animation: 'fadeUp 0.4s ease',
  },
} as const;
