import type { SxProps, Theme } from '@mui/material';

export const BRAND_RED = '#C41E3A';
export const BRAND_DARK = '#8A0303';
export const BRAND_BG = '#FFF1F2';

export const pageWrapper: SxProps<Theme> = {
    width: '100%',
};

export const pageHeader: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    mb: 3,
};

export const breadcrumbRow: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    gap: 0.5,
    mb: 0.5,
};

export const sectionCard: SxProps<Theme> = {
    background: '#fff',
    borderRadius: '12px',
    border: '1px solid',
    borderColor: 'grey.200',
    p: 3,
    mb: 2.5,
};

export const sectionTitle: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    mb: 2.5,
    pb: 1.5,
    borderBottom: '1px solid',
    borderColor: 'grey.100',
};

export const fieldRow: SxProps<Theme> = {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
    gap: 2.5,
    mb: 2.5,
};

export const fieldLabel: SxProps<Theme> = {
    fontSize: '12px',
    fontWeight: 600,
    color: 'grey.700',
    mb: 0.7,
    letterSpacing: '0.2px',
};

export const inputBase: SxProps<Theme> = {
    width: '100%',
    background: '#F9FAFB',
    border: '1.5px solid',
    borderColor: 'grey.200',
    borderRadius: '8px',
    px: 1.5,
    py: 1,
    fontSize: '13.5px',
    color: 'grey.800',
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    '&:focus-within': {
        borderColor: BRAND_RED,
        background: '#fff',
    },
    transition: 'border-color 0.15s, background 0.15s',
};

export const selectBase: SxProps<Theme> = {
    width: '100%',
    background: '#F9FAFB',
    borderRadius: '8px',
    fontSize: '13.5px',
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'grey.200',
        borderWidth: '1.5px',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: BRAND_RED,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: BRAND_RED,
    },
};

export const tagChip: SxProps<Theme> = {
    background: BRAND_BG,
    color: BRAND_RED,
    borderRadius: '6px',
    fontWeight: 600,
    fontSize: '12px',
    height: 28,
    '& .MuiChip-deleteIcon': {
        color: BRAND_RED,
        fontSize: 14,
        '&:hover': { color: BRAND_DARK },
    },
};

export const skillsBox: SxProps<Theme> = {
    border: '1.5px solid',
    borderColor: 'grey.200',
    borderRadius: '8px',
    background: '#F9FAFB',
    p: 1.5,
    display: 'flex',
    flexWrap: 'wrap',
    gap: 1,
    alignItems: 'center',
    minHeight: 52,
    '&:focus-within': {
        borderColor: BRAND_RED,
        background: '#fff',
    },
};

export const actionRow: SxProps<Theme> = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 1.5,
    mt: 1,
};
