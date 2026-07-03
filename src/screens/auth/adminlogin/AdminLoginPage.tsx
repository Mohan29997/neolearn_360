import { Fragment } from 'react';
import {
  Box, Button, Checkbox, FormControl, FormControlLabel,
  IconButton, InputAdornment, MenuItem, OutlinedInput, Select,
  Typography, Link,
} from '@mui/material';
import {
  VisibilityRounded, VisibilityOffRounded,
  LockOutlined, VerifiedUserOutlined, ShieldOutlined, PersonOutlined, KeyboardArrowDownRounded,
} from '@mui/icons-material';
import TabTitle from '../../../components/tabtitle';
import { useLogin } from '../../../features/auth/hooks/useLogin';
import { loginStyles as ls } from './AdminLogin.styles';
import { FOOTER_LINKS, DECORATIVE_CIRCLES } from './AdminLogin.constants';

const AdminLoginPage = () => {
  const {
    isLoading, showPassword, remember, emailUsername, emailDomain, credentials, emailDomains,
    setShowPassword, setRemember, handleUsernameChange, handleDomainChange, handlePasswordChange, submitLogin,
  } = useLogin();

  return (
    <Fragment>
      <TabTitle title="NeoLearn360 - Login" />
      <Box sx={ls.root}>

        {/* Left Panel */}
        <Box sx={ls.leftPanel}>
          {DECORATIVE_CIRCLES.map((c, i) => (
            <Box key={i} sx={ls.decorativeCircle(c.size, c.top, c.right)} />
          ))}
          <Box sx={ls.logoArea}>
            <Box sx={ls.logoBox}><VerifiedUserOutlined sx={ls.logoIcon} /></Box>
            <Typography sx={ls.logoText}>NeoLearn360</Typography>
          </Box>
          <Box sx={ls.heroContent}>
            <Typography variant="h4" sx={ls.heroTitle}>
              Empowering Enterprise Growth Through Intelligence.
            </Typography>
            <Typography sx={ls.heroSub}>
              Access your personalized learning ecosystem. Coordinate programs, track progress, and deploy talent with precision.
            </Typography>
            <Box sx={ls.chartBox}>
              {[...Array(4)].map((_, i) => <Box key={i} sx={ls.chartBar(i)} />)}
            </Box>
          </Box>
          <Box sx={ls.securityRow}>
            <ShieldOutlined sx={ls.securityIcon} />
            <Typography sx={ls.securityText}>Enterprise Grade Security Active</Typography>
          </Box>
        </Box>

        {/* Right Panel */}
        <Box sx={ls.rightPanel}>
          <Box sx={ls.formWrapper}>
            <Box component="form" onSubmit={submitLogin} sx={ls.form}>
              <Typography variant="h5" fontWeight={700} sx={ls.formTitle}>Sign In</Typography>
              <Typography sx={ls.formSub}>Enter your corporate credentials to access the dashboard.</Typography>

              <Typography sx={ls.emailLabel}>Corporate Email</Typography>
              <Box sx={ls.emailRow}>
                <OutlinedInput fullWidth name="emailUsername" placeholder="mohan.kotak" value={emailUsername}
                  onChange={e => handleUsernameChange(e.target.value)} inputProps={{ maxLength: 30 }}
                  startAdornment={<InputAdornment position="start"><PersonOutlined sx={{ fontSize: 18, color: 'text.disabled' }} /></InputAdornment>}
                  sx={{ flex: 1 }} />
                <Box sx={ls.atSign}><Typography sx={ls.atText}>@</Typography></Box>
                <FormControl sx={{ minWidth: 180 }}>
                  <Select value={emailDomain} onChange={e => handleDomainChange(e.target.value)} IconComponent={KeyboardArrowDownRounded}>
                    {emailDomains.map(domain => <MenuItem key={domain} value={domain}>{domain}</MenuItem>)}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={ls.passwordLabelRow}>
                <Typography sx={ls.passwordLabel}>Password</Typography>
                <Link href="#" underline="hover" sx={ls.forgotLink}>Forgot password?</Link>
              </Box>
              <OutlinedInput fullWidth name="password" placeholder="••••••••"
                type={showPassword ? 'text' : 'password'} value={credentials.password}
                onChange={e => handlePasswordChange(e.target.value)} inputProps={{ maxLength: 50 }}
                startAdornment={<InputAdornment position="start"><LockOutlined sx={{ fontSize: 18, color: 'text.disabled' }} /></InputAdornment>}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(p => !p)} edge="end" size="small">
                      {showPassword ? <VisibilityRounded sx={{ fontSize: 18 }} /> : <VisibilityOffRounded sx={{ fontSize: 18 }} />}
                    </IconButton>
                  </InputAdornment>
                }
                sx={ls.passwordInput} />

              <FormControlLabel sx={ls.rememberRow}
                control={<Checkbox checked={remember} onChange={e => setRemember(e.target.checked)} size="small" sx={ls.checkbox} />}
                label={<Typography sx={ls.rememberText}>Remember this device</Typography>}
              />

              <Button type="submit" variant="contained" fullWidth size="large"
                loading={isLoading} endIcon={!isLoading && <span>→</span>} sx={ls.submitBtn}>
                {!isLoading && 'Sign In'}
              </Button>
            </Box>
          </Box>

          <Box sx={ls.footer}>
            {FOOTER_LINKS.map(item => (
              <Link key={item} href="#" underline="hover" sx={ls.footerLink}>{item}</Link>
            ))}
          </Box>
        </Box>
      </Box>
    </Fragment>
  );
};

export default AdminLoginPage;
