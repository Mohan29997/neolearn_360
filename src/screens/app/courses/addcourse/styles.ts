import type { SxProps, Theme } from '@mui/material';

export const BRAND_RED = '#B0002A';
export const BRAND_DARK = '#8A0303';

export const breadcrumbRow: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    gap: 0.5,
    mb: 2.5,
};

export const heroBanner: SxProps<Theme> = {
    borderRadius: '16px',
    overflow: 'hidden',
    mb: 3,
    height: 140,
    position: 'relative',
    background: 'linear-gradient(120deg, #1a1a2e 0%, #16213e 40%, #0f3460 70%, #533483 100%)',
    display: 'flex',
    alignItems: 'center',
    px: 4,
};

export const heroBannerOverlay: SxProps<Theme> = {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(90deg, rgba(140,0,30,0.82) 0%, rgba(80,0,15,0.55) 60%, transparent 100%)',
};

export const twoColLayout: SxProps<Theme> = {
    display: 'flex',
    gap: 2.5,
    alignItems: 'flex-start',
};

export const formCard: SxProps<Theme> = {
    background: '#fff',
    borderRadius: '16px',
    border: '1px solid #E8DCDD',
    p: 3,
};

export const sideCard: SxProps<Theme> = {
    background: '#fff',
    borderRadius: '16px',
    border: '1px solid #E8DCDD',
    p: 2.5,
    mb: 2,
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
    border: '1.5px solid #E8DCDD',
    borderRadius: '10px',
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
    borderRadius: '10px',
    fontSize: '13.5px',
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#E8DCDD',
        borderWidth: '1.5px',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: BRAND_RED },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: BRAND_RED },
};

export const textareaBase: SxProps<Theme> = {
    width: '100%',
    background: '#F9FAFB',
    border: '1.5px solid #E8DCDD',
    borderRadius: '10px',
    px: 1.5,
    py: 1.2,
    '&:focus-within': {
        borderColor: BRAND_RED,
        background: '#fff',
    },
    transition: 'border-color 0.15s, background 0.15s',
};

export const certCard: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#F9FAFB',
    border: '1.5px solid #E8DCDD',
    borderRadius: '10px',
    px: 2,
    py: 1.5,
    mb: 3,
};

export const switchSx: SxProps<Theme> = {
    '& .MuiSwitch-switchBase.Mui-checked': { color: BRAND_RED },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: BRAND_RED },
};

export const promoCard: SxProps<Theme> = {
    borderRadius: '16px',
    overflow: 'hidden',
    mb: 2,
    p: 2.5,
    background: `linear-gradient(135deg, ${BRAND_DARK} 0%, #C0003A 60%, #E8004A 100%)`,
    position: 'relative',
};

export const bulkUploadCard: SxProps<Theme> = {
    borderRadius: '16px',
    border: '2px dashed #E8DCDD',
    background: '#fff',
    p: 2.5,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: 0.5,
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
