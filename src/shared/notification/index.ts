import { enqueueSnackbar, type SnackbarKey, type SnackbarMessage } from 'notistack';
import SnackBar from '../../components/snackbar';
import type { SnackVariant } from '../../types/common.types';

export const notify = (message: SnackbarMessage, variant: SnackVariant = 'default') => {
  return enqueueSnackbar(message, {
    variant,
    content: (key: SnackbarKey, msg: SnackbarMessage) => SnackBar(key, msg, variant),
  });
};
