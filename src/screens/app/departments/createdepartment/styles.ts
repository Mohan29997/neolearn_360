import type { SxProps, Theme } from '@mui/material';

export const BRAND_RED = '#C41E3A';
export const BRAND_DARK = '#8A0303';

export const breadcrumbRow: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    gap: 0.5,
    mb: 2.5,
};

export const twoColLayout: SxProps<Theme> = {
    display: 'flex',
    gap: 2.5,
    alignItems: 'flex-start',
};

export const formCard: SxProps<Theme> = {
    background: '#fff',
    borderRadius: '12px',
    border: '1px solid',
    borderColor: 'grey.200',
    p: 3,
};

export const previewCard: SxProps<Theme> = {
    background: '#fff',
    borderRadius: '12px',
    border: '1px solid',
    borderColor: 'grey.200',
    overflow: 'visible',
};

export const fieldRow: SxProps<Theme> = {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
    gap: 2.5,
    mb: 2.5,
};

export const fieldLabelSx: SxProps<Theme> = {
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
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: BRAND_RED },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: BRAND_RED },
};

export const switchSx: SxProps<Theme> = {
    '& .MuiSwitch-switchBase.Mui-checked': { color: BRAND_RED },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: BRAND_RED },
};

export const coordinatorChip: SxProps<Theme> = {
    background: '#F9FAFB',
    border: '1px solid',
    borderColor: 'grey.200',
    borderRadius: '20px',
    height: 30,
    fontSize: '12px',
    fontWeight: 500,
    '& .MuiChip-deleteIcon': {
        color: 'grey.400',
        fontSize: 14,
        '&:hover': { color: 'grey.700' },
    },
};

export const tagBox: SxProps<Theme> = {
    border: '1.5px solid',
    borderColor: 'grey.200',
    borderRadius: '8px',
    background: '#F9FAFB',
    p: 1.5,
    display: 'flex',
    flexWrap: 'wrap',
    gap: 1,
    alignItems: 'center',
    minHeight: 56,
    '&:focus-within': {
        borderColor: BRAND_RED,
        background: '#fff',
    },
};

export const resourceChip: SxProps<Theme> = {
    background: '#FFF1F2',
    color: BRAND_RED,
    border: '1px solid #FECDD3',
    borderRadius: '6px',
    height: 26,
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.3px',
    '& .MuiChip-deleteIcon': {
        color: BRAND_RED,
        fontSize: 13,
        opacity: 0.7,
        '&:hover': { opacity: 1 },
    },
};

export const actionRow: SxProps<Theme> = {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 1,
    mt: 1,
    pt: 2.5,
    borderTop: '1px solid',
    borderColor: 'grey.100',
};

export const coverImageSx: SxProps<Theme> = {
    height: 120,
    borderRadius: '12px 12px 0 0',
    overflow: 'hidden',
    background: 'linear-gradient(140deg, #1B2F4A 0%, #1F4E79 35%, #2E86AB 65%, #7EC8C8 100%)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    p: 1,
};

export const changeCoverBtnSx: SxProps<Theme> = {
    background: 'rgba(255,255,255,0.88)',
    backdropFilter: 'blur(4px)',
    color: 'grey.700',
    fontSize: '11px',
    fontWeight: 600,
    borderRadius: '6px',
    textTransform: 'none',
    py: 0.4,
    px: 1.2,
    minWidth: 'unset',
    '&:hover': { background: 'rgba(255,255,255,1)' },
};

export const deptIconBoxSx: SxProps<Theme> = {
    width: 62,
    height: 62,
    borderRadius: '14px',
    background: '#FFF1F2',
    border: '3px solid #fff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 2,
};

export const previewSectionLabelSx: SxProps<Theme> = {
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.9px',
    color: 'grey.400',
    textTransform: 'uppercase' as const,
    mb: 1,
};
