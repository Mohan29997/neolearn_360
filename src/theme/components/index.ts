// src/theme/components/index.ts
import type { Components, Theme } from '@mui/material/styles';
import { MuiAutocomplete } from "./MuiAutocomplete";
import { MuiFormHelperText } from "./MuiFormHelperText";
import { MuiInputLabel } from "./MuiInputLabel";
import { MuiOutlinedInput } from "./MuiOutlinedInput";
import { MuiButton } from './MuiButton';
import { MuiFormControl } from './MuiFormControl';
import { MuiPaper } from './MuiPaper';
import { MuiAlert } from './MuiAlert';
import { MuiAvatar } from './MuiAvatar';
import { MuiTabs } from './MuiTabs';
import { MuiTab } from './MuiTab';
import { MuiIconButton } from './MuiIconButton';
import { MuiSkeleton } from './MuiSkeleton';
import { MuiDivider } from './MuiDivider';
import { MuiButtonBase } from './MuiButtonBase';
import { MuiPopover } from './MuiPopover';
import { MuiTooltip } from './MuiTooltip';

export const components = (theme: Theme): Components => {

    return {
        MuiAutocomplete: MuiAutocomplete(theme),
        MuiFormHelperText: MuiFormHelperText(theme),
        MuiInputLabel: MuiInputLabel(theme),
        MuiOutlinedInput: MuiOutlinedInput(theme),
        MuiButton: MuiButton(theme),
        MuiButtonBase: MuiButtonBase(theme),
        MuiFormControl: MuiFormControl(theme),
        MuiPaper: MuiPaper(theme),
        MuiAlert: MuiAlert(theme),
        MuiAvatar: MuiAvatar(theme),
        MuiTabs: MuiTabs(theme),
        MuiTab: MuiTab(theme),
        MuiIconButton: MuiIconButton(theme),
        MuiSkeleton: MuiSkeleton(theme),
        MuiDivider: MuiDivider(theme),
        MuiPopover: MuiPopover(theme),
        MuiTooltip: MuiTooltip(theme),
    }
};
