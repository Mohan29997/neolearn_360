import React, { Fragment, useState, } from 'react'
import { Box, Button, FormControl, InputLabel, OutlinedInput, Paper, Typography, } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import TabTitle from '../../../components/tabtitle'
import { blooddonationbg } from '../../../assets/images';
import { MessageIocnSvg } from '../../../assets/svg'
import { useMUITheme } from '../../../hooks/useMUITheme'
import { SnackNotification } from '../../../helper/snackMessage';

const AdminLogin = () => {
    const { palette } = useMUITheme();
    const navigation = useNavigate();
    const [isLoading, setIsLoading] = useState<true | false>(false)
    const [inputValue, setInputValue] = useState({
        mobile: '',
    });

    const onSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isLoading) return
        if (!inputValue.mobile) return SnackNotification("Enter Mobile Number.", 'error')
        setIsLoading(true)
        
    };

    return (
        <Fragment>
            <TabTitle title='Admin Login' />
            <Box
                sx={{
                    backgroundImage: `url(${blooddonationbg})`,
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
                        <Typography variant='h5' color={palette.success.light}>
                            Secure access for administrators. Enter your mobile number to receive an OTP.
                        </Typography>
                        <Typography variant='h6' color={palette.grey[300]}>
                            Stay protected. Verify your mobile number to continue to the dashboard.
                        </Typography>
                    </Box>
                    <FormControl fullWidth>
                        <InputLabel htmlFor='outlined-adornment-mobile-number'>
                            Enter Mobile Number
                        </InputLabel>
                        <OutlinedInput
                            fullWidth
                            placeholder='Enter Mobile Number'
                            value={inputValue.mobile}
                            name='mobile'
                            onChange={(event) => { setInputValue({ ...inputValue, [event.target.name]: event.target.value }) }}
                            onInput={(e: any) => {
                                const target = e.target as HTMLInputElement
                                target.value = target.value.replace(/[^0-9]/g, '')
                            }}
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 10 }}
                        />
                    </FormControl>

                    <Button
                        variant='contained'
                        size='large'
                        fullWidth
                        type="submit"
                        loading={isLoading}
                    >
                        Send OTP
                    </Button>
                </Paper>
            </Box>
        </Fragment>
    )
}

export default AdminLogin