// @mui
import { alpha } from '@mui/material/styles';
//

function customShadows(): { z1: string; z4: string; z8: string; z12: string; z16: string; z20: string; z24: string; primary: string; info: string; secondary: string; success: string; warning: string; error: string; paper: string; card: string; dialog: string; dropdown: string; } {
  const transparent = alpha("#667085", 0.16);

  return {
    z1: `0 1px 2px 0 ${transparent}`,
    z4: `0 4px 8px 0 ${transparent}`,
    z8: `0 8px 16px 0 ${transparent}`,
    z12: `0 12px 24px -4px ${transparent}`,
    z16: `0 16px 32px -4px ${transparent}`,
    z20: `0 20px 40px -4px ${transparent}`,
    z24: `0 24px 48px 0 ${transparent}`,
    //
    primary: `0 8px 16px 0 ${alpha("#2065D1", 0.24)}`,
    info: `0 8px 16px 0 ${alpha("#1890FF", 0.24)}`,
    secondary: `0 8px 16px 0 ${alpha("#3366FF", 0.24)}`,
    success: `0 8px 16px 0 ${alpha("#54D62C", 0.24)}`,
    warning: `0 8px 16px 0 ${alpha("#FFC107", 0.24)}`,
    error: `0 8px 16px 0 ${alpha("#FF4842", 0.24)}`,
    //
    paper: 'rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px',
    card: `0 0 2px 0 ${alpha("#667085", 0.2)}, 0 12px 24px -4px ${alpha("#667085", 0.12)}`,
    dialog: `-40px 40px 80px -8px ${alpha("#667085", 0.24)}`,
    dropdown: `0 0 2px 0 ${alpha("#667085", 0.24)}, -20px 20px 40px -4px ${alpha("#667085", 0.24)}`,
  };
}

export const customShadow = customShadows();
