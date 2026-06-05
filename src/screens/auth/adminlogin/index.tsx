import React, { Fragment, useState } from 'react'
import {
    Box, Button, Checkbox, FormControl, FormControlLabel,
    IconButton, InputAdornment, MenuItem, OutlinedInput, Select,
    Typography, Link,
} from '@mui/material'
import {
    VisibilityRounded, VisibilityOffRounded,
    LockOutlined, VerifiedUserOutlined, ShieldOutlined, PersonOutlined, KeyboardArrowDownRounded,
} from '@mui/icons-material'
import TabTitle from '../../../components/tabtitle'
import { SnackNotification } from '../../../helper/snackMessage'
import type { ILoginPayload } from '../../../service/service'
import { service } from '../../../service'
import { useDispatch } from 'react-redux'
import { setIsLogin } from '../../../store/reducer/AuthHelper'
import { StorageManager } from '../../../storagemanager'

const EMAIL_DOMAINS = ['neosoftmail.com', 'neosoft.in', 'neosoft.com']

const AdminLogin = () => {
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [remember, setRemember] = useState(false)
    const [emailUsername, setEmailUsername] = useState('')
    const [emailDomain, setEmailDomain] = useState(EMAIL_DOMAINS[0])
    const [inputValue, setInputValue] = useState<ILoginPayload>({ username: '', password: '' })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(prev => ({ ...prev, [e.target.name]: e.target.value.replace(/\s/g, '') }))
    }

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s|@/g, '')
        setEmailUsername(value)
        setInputValue(prev => ({ ...prev, username: value ? `${value}@${emailDomain}` : '' }))
    }

    const handleDomainChange = (domain: string) => {
        setEmailDomain(domain)
        setInputValue(prev => ({ ...prev, username: emailUsername ? `${emailUsername}@${domain}` : '' }))
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (isLoading) return
        if (!inputValue.username) return SnackNotification('Please enter email.', 'error')
        if (!inputValue.password) return SnackNotification('Please enter password.', 'error')
        setIsLoading(true)
        service.userlogin(inputValue)
            .then(response => {
                console.log('🚀 ~ AdminLogin ~ response:', response)
                if (response.status === 200) {
                    StorageManager.setAccessToken(response.data?.accessToken)
                    StorageManager.setRefreshToken(response.data?.refreshToken)
                    dispatch(setIsLogin({ isLogin: true }))
                }
            })
            .catch(() => { })
            .finally(() => setIsLoading(false))
    }

    return (
        <Fragment>
            <TabTitle title='NeoLearn360 - Login' />
            <Box sx={{ display: 'flex', height: '100vh', width: '100%', bgcolor: '#f7f9fc' }}>

                {/* ── Left Panel ── */}
                <Box sx={{
                    width: { xs: 0, md: '46%' },
                    display: { xs: 'none', md: 'flex' },
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    bgcolor: '#8B1A2E',
                    p: 4,
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    {/* decorative circles */}
                    {[{ size: 340, top: -80, right: -80 }, { size: 220, top: 80, right: 60 }].map((c, i) => (
                        <Box key={i} sx={{
                            position: 'absolute', top: c.top, right: c.right,
                            width: c.size, height: c.size, borderRadius: '50%',
                            border: '1px solid rgba(255,255,255,0.08)',
                            pointerEvents: 'none',
                        }} />
                    ))}

                    {/* logo */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, zIndex: 1 }}>
                        <Box sx={{
                            bgcolor: 'white', borderRadius: 2, p: 0.8,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <VerifiedUserOutlined sx={{ color: '#8B1A2E', fontSize: 22 }} />
                        </Box>
                        <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 18 }}>NeoLearn360</Typography>
                    </Box>

                    {/* headline */}
                    <Box sx={{ zIndex: 1 }}>
                        <Typography variant='h4' sx={{ color: 'white', fontWeight: 800, lineHeight: 1.3, mb: 2 }}>
                            Empowering Enterprise Growth Through Intelligence.
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.72)', fontSize: 14, lineHeight: 1.7, mb: 4 }}>
                            Access your personalized learning ecosystem. Coordinate programs, track progress, and deploy talent with precision.
                        </Typography>

                        {/* mock dashboard preview */}
                        <Box sx={{
                            borderRadius: 3, overflow: 'hidden',
                            border: '1px solid rgba(255,255,255,0.15)',
                            bgcolor: 'rgba(0,0,0,0.25)',
                            height: 210,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            {[...Array(4)].map((_, i) => (
                                <Box key={i} sx={{
                                    m: 1, bgcolor: 'rgba(255,255,255,0.1)',
                                    borderRadius: 1, height: 120 + i * 10, width: 60,
                                }} />
                            ))}
                        </Box>
                    </Box>

                    {/* footer badge */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, zIndex: 1 }}>
                        <ShieldOutlined sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 16 }} />
                        <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
                            Enterprise Grade Security Active
                        </Typography>
                    </Box>
                </Box>

                {/* ── Right Panel ── */}
                <Box sx={{
                    flex: 1, display: 'flex', flexDirection: 'column',
                    justifyContent: 'space-between', p: { xs: 3, md: 6 }, bgcolor: 'white',
                }}>
                    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Box
                            component='form'
                            onSubmit={onSubmit}
                            sx={{ width: '100%', maxWidth: 420 }}
                        >
                            <Typography variant='h5' fontWeight={700} sx={{ mb: 0.5 }}>Sign In</Typography>
                            <Typography sx={{ color: 'text.disabled', fontSize: 14, mb: 3.5 }}>
                                Enter your corporate credentials to access the dashboard.
                            </Typography>

                            {/* Email */}
                            <Typography sx={{ fontSize: 13, fontWeight: 500, mb: 0.8 }}>Corporate Email</Typography>
                            <Box sx={{ display: 'flex', gap: 1, mb: 2.5 }}>
                                <OutlinedInput
                                    fullWidth
                                    name='emailUsername'
                                    placeholder='mohan.kotak'
                                    value={emailUsername}
                                    onChange={handleUsernameChange}
                                    inputProps={{ maxLength: 30 }}
                                    startAdornment={
                                        <InputAdornment position='start'>
                                            <PersonOutlined sx={{ fontSize: 18, color: 'text.disabled' }} />
                                        </InputAdornment>
                                    }
                                    sx={{ flex: 1 }}
                                />
                                <Box sx={{ display: 'flex', alignItems: 'center', px: 1 }}>
                                    <Typography sx={{ fontSize: 16, color: 'text.disabled' }}>@</Typography>
                                </Box>
                                <FormControl sx={{ minWidth: 180 }}>
                                    <Select
                                        value={emailDomain}
                                        onChange={e => handleDomainChange(e.target.value)}
                                        IconComponent={KeyboardArrowDownRounded}
                                    >
                                        {EMAIL_DOMAINS.map(domain => (
                                            <MenuItem key={domain} value={domain}>{domain}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>

                            {/* Password */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                                <Typography sx={{ fontSize: 13, fontWeight: 500 }}>Password</Typography>
                                <Link href='#' underline='hover' sx={{ fontSize: 13, color: '#8B1A2E', fontWeight: 500 }}>
                                    Forgot password?
                                </Link>
                            </Box>
                            <OutlinedInput
                                fullWidth
                                name='password'
                                placeholder='••••••••'
                                type={showPassword ? 'text' : 'password'}
                                value={inputValue.password}
                                onChange={handleChange}
                                inputProps={{ maxLength: 50 }}
                                startAdornment={
                                    <InputAdornment position='start'>
                                        <LockOutlined sx={{ fontSize: 18, color: 'text.disabled' }} />
                                    </InputAdornment>
                                }
                                endAdornment={
                                    <InputAdornment position='end'>
                                        <IconButton onClick={() => setShowPassword(p => !p)} edge='end' size='small'>
                                            {showPassword
                                                ? <VisibilityRounded sx={{ fontSize: 18 }} />
                                                : <VisibilityOffRounded sx={{ fontSize: 18 }} />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                sx={{ mb: 2.5 }}
                            />

                            {/* Remember */}
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={remember}
                                        onChange={e => setRemember(e.target.checked)}
                                        size='small'
                                        sx={{ color: '#8B1A2E', '&.Mui-checked': { color: '#8B1A2E' } }}
                                    />
                                }
                                label={<Typography sx={{ fontSize: 13 }}>Remember this device</Typography>}
                                sx={{ mb: 2.5 }}
                            />

                            {/* Submit */}
                            <Button
                                type='submit'
                                variant='contained'
                                fullWidth
                                size='large'
                                loading={isLoading}
                                endIcon={!isLoading && <span>→</span>}
                                sx={{
                                    bgcolor: '#8B1A2E',
                                    '&:hover': { bgcolor: '#6e1424' },
                                    borderRadius: 2,
                                    fontWeight: 700,
                                    fontSize: 15,
                                    py: 1.4,
                                }}
                            >
                                {!isLoading && 'Sign In'}
                            </Button>
                        </Box>
                    </Box>

                    {/* Footer links */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, pt: 2 }}>
                        {['Support', 'Privacy Policy', 'Terms of Service'].map(item => (
                            <Link key={item} href='#' underline='hover' sx={{ fontSize: 13, color: 'text.disabled' }}>
                                {item}
                            </Link>
                        ))}
                    </Box>
                </Box>
            </Box>
        </Fragment>
    )
}

export default AdminLogin
