import { enqueueSnackbar, type SnackbarKey, type SnackbarMessage } from "notistack"
import SnackBar from "../components/snackbar"

export const SnackNotification = (message: SnackbarMessage, messageVariant: "default" | "error" | "success" | "warning" | "info" | undefined = "default") => {
    return enqueueSnackbar(message, {
        variant: messageVariant,
        content: (key: SnackbarKey, message: SnackbarMessage) => { return SnackBar(key, message, messageVariant) }
    })
}