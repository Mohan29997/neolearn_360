import { enqueueSnackbar, type SnackbarKey, type SnackbarMessage } from "notistack"
import SnackBar from "../components/snackbar"

/**
 * Displays a styled snackbar notification using notistack.
 * Renders a custom `<SnackBar>` component so the appearance matches the app theme.
 *
 * @param message - Text or React node to display
 * @param messageVariant - Severity level; defaults to `"default"`
 *
 * @example
 * SnackNotification('Course assigned successfully', 'success');
 * SnackNotification('Failed to fetch data', 'error');
 */
export const SnackNotification = (message: SnackbarMessage, messageVariant: "default" | "error" | "success" | "warning" | "info" | undefined = "default") => {
    return enqueueSnackbar(message, {
        variant: messageVariant,
        content: (key: SnackbarKey, message: SnackbarMessage) => { return SnackBar(key, message, messageVariant) }
    })
}