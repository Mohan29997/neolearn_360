import { type ReactNode } from 'react'
import { SnackbarProvider as SnackBar } from 'notistack'

const SnackbarProvider = ({ children }: { children?: ReactNode }) => {
    return (
        <SnackBar
            anchorOrigin={{
                vertical: "top",
                horizontal: 'right',
            }}
            maxSnack={3}
            autoHideDuration={3000}
            // action={snackbarKey => <SnackbarCloseButton snackbarKey={snackbarKey} />}
        >
            {children}
        </SnackBar>
    )
}

export default SnackbarProvider