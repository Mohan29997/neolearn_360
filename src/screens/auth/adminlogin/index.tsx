import React, { Fragment, useState, } from 'react'
import { Box, Button, FormControl, IconButton, InputLabel, OutlinedInput, Paper, Typography, } from '@mui/material';
import { VisibilityRounded, VisibilityOffRounded } from '@mui/icons-material';
import TabTitle from '../../../components/tabtitle'
import { loginBg } from '../../../assets/images';
import { MessageIocnSvg } from '../../../assets/svg'
import { useMUITheme } from '../../../hooks/useMUITheme'
import { SnackNotification } from '../../../helper/snackMessage';
import type { ILoginPayload } from '../../../service/service';
import { service } from '../../../service';
import { useDispatch } from 'react-redux';
import { setIsLogin } from '../../../store/reducer/AuthHelper';
import { StorageManager } from '../../../storagemanager';

const AdminLogin = () => {
    const { palette } = useMUITheme();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState<true | false>(false)
    const [isVisble, setIsVisble] = useState<true | false>(false)
    const [inputValue, setInputValue] = useState<ILoginPayload>({
        username: "",
        password: ""
    });

    const onSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isLoading) return
        if (!inputValue.username) return SnackNotification("Please enter usernmae.", 'error')
        if (!inputValue.password) return SnackNotification("Please enter password.", 'error')
        setIsLoading(true)
        service.userlogin(inputValue)
            .then((response) => {
                if (response.status === 200) {
                    StorageManager.setAccessToken(response.data?.accessToken);
                    StorageManager.setRefreshToken(response.data?.refreshToken);
                    dispatch(setIsLogin({ isLogin: true }));
                }
            })
            .catch(() => { })
            .finally(() => { setIsLoading(false) })

    };

    return (
        <Fragment>
            <TabTitle title='Neo Learn 360 - Login' />
            <Box
                sx={{
                    backgroundImage: `url(${loginBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '100vh',
                    width: '100%',
                    alignItems: 'center',
                    display: 'flex',
                    p: 5
                    // pl: 30
                }}
            >
                <Paper component={"form"} onSubmit={(e) => { onSubmit(e) }}
                    sx={{
                        maxWidth: 445,
                        p: 4,
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        alignItems: "center"
                        // backdropFilter: "blur(1px)",
                        // WebkitBackdropFilter: "blur(1px)"
                    }}
                >
                    <MessageIocnSvg />
                    <Box sx={{ gap: 1, display: "flex", flexDirection: "column" }}>
                        <Typography variant='h5' align="center" sx={{ color: palette.success.light }}>
                            Secure access for administrators. Enter your username and password.
                        </Typography>
                    </Box>
                    <FormControl fullWidth>
                        <InputLabel htmlFor='outlined-adornment-username'>
                            Enter username
                        </InputLabel>
                        <OutlinedInput
                            fullWidth
                            placeholder='Enter username'
                            value={inputValue.username}
                            name="username"
                            onChange={(event) => { setInputValue({ ...inputValue, [event.target.name]: event.target.value }) }}
                            onInput={(e: any) => {
                                const target = e.target as HTMLInputElement;
                                target.value = target.value.replace(/\s/g, '');
                            }}
                            inputProps={{ inputMode: "email", maxLength: 50 }}
                        />
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel htmlFor='outlined-adornment-password'>
                            Password
                        </InputLabel>
                        <OutlinedInput
                            fullWidth
                            placeholder='Enter password.'
                            type={isVisble ? "text" : "password"}
                            value={inputValue.password}
                            name="password"
                            onChange={(event) => { setInputValue({ ...inputValue, [event.target.name]: event.target.value }) }}
                            onInput={(e: any) => {
                                const target = e.target as HTMLInputElement;
                                target.value = target.value.replace(/\s/g, '');
                            }}
                            inputProps={{ inputMode: "text", maxLength: 50 }}
                            endAdornment={<IconButton onClick={() => { setIsVisble(!isVisble) }}>
                                {isVisble ? <VisibilityRounded /> : <VisibilityOffRounded />}
                            </IconButton>}
                        />
                    </FormControl>

                    <Button
                        variant='contained'
                        size='large'
                        fullWidth
                        type="submit"
                        loadingPosition="center"
                        loading={isLoading}
                    >
                        {!isLoading && "Log In"}
                    </Button>
                </Paper>
            </Box>
        </Fragment>
    )
}

export default AdminLogin