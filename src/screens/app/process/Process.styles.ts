export const processExtraStyles = {
  formCard: { p: 3 },
  formSectionTitle: { fontWeight: 700, mb: 2.5 },
  fieldLabel: { mb: 0.6, display: 'block', fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.04em', textTransform: 'uppercase' },
  cancelBtn: { textTransform: 'none', borderRadius: '8px', fontWeight: 600, px: 3 },
  emptyStateCard: { p: 6, textAlign: 'center' },
  emptyStateIcon: { fontSize: 40, mb: 1.5 },
  processCard: { p: 2.5, mb: 2 },
  processCardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap', mb: 1 },
  processName: { fontWeight: 700 },
  processCategoryChip: { fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.03em', textTransform: 'uppercase' },
  processDescription: { mb: 2 },
  reviewerRow: { display: 'flex', alignItems: 'stretch', gap: 1.5, flexWrap: 'wrap', pt: 2, borderTop: '1px solid' },
  reviewerBox: {
    display: 'flex', alignItems: 'center', gap: 1.2, px: 1.6, py: 1.1,
    borderRadius: '8px', flex: 1, minWidth: 230, border: '1px solid',
  },
  reviewerAvatar: {
    width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center',
    justifyContent: 'center', flexShrink: 0, fontWeight: 700, fontSize: '0.75rem',
  },
  reviewerLabel: { fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' },
  reviewerName: { fontWeight: 600, fontSize: '0.85rem', lineHeight: 1.3 },
  approveBtn: {
    textTransform: 'none', fontWeight: 600, borderRadius: '6px', fontSize: '0.72rem',
    minWidth: 'unset', px: 1.2, py: 0.3, color: '#16A34A', borderColor: '#BBF7D0',
    '&:hover': { borderColor: '#16A34A', bgcolor: '#F0FDF4' },
  },
  rejectBtn: {
    textTransform: 'none', fontWeight: 600, borderRadius: '6px', fontSize: '0.72rem',
    minWidth: 'unset', px: 1.2, py: 0.3, color: '#DC2626', borderColor: '#FECACA',
    '&:hover': { borderColor: '#DC2626', bgcolor: '#FEF2F2' },
  },
} as const;

export const STATUS_CHIP_STYLES: Record<'pending' | 'approved' | 'rejected', { bgcolor: string; color: string; borderColor: string }> = {
  pending: { bgcolor: '#FFFBEB', color: '#B45309', borderColor: '#FDE68A' },
  approved: { bgcolor: '#F0FDF4', color: '#15803D', borderColor: '#BBF7D0' },
  rejected: { bgcolor: '#FEF2F2', color: '#B91C1C', borderColor: '#FECACA' },
};
