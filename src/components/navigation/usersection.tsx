import { Fragment, useState } from 'react';
import { Box, useTheme, Avatar, Typography, Divider, Stack, Popover, Chip, MenuItem } from '@mui/material'
import { BadgeRounded, EmailRounded, WorkRounded, KeyboardArrowDownRounded, PersonRounded } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import UserLogout from './userlogout';
import { StorageManager } from '../../storagemanager';
import { setIsLogin } from '../../store/reducer/AuthHelper';
import { resetProfile } from '../../store/reducer/AdminProfile';
import { useAppSelector } from '../../hooks/useAppSelector';
import { appnavigationpath } from '../../navigation/appnavigation/apppath';

const BRAND_RED = '#8B1A2E';

const UserSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { palette: { primary, common, text, error } } = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const profile = useAppSelector((state) => state.adminProfile);

  const onLogout = () => {
    StorageManager.removeItems();
    sessionStorage.clear();
    dispatch(setIsLogin({ isLogin: false }));
    dispatch(resetProfile());
    setAnchorEl(null);
  };

  const initials = profile?.name
    ? profile.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'A';

  return (
    <Fragment>
      {/* Clickable trigger */}
      <Box
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          display: 'flex', alignItems: 'center', gap: 1, ml: 1, cursor: 'pointer',
          px: 1.2, py: 0.6, borderRadius: '10px',
          border: open ? `1.5px solid ${BRAND_RED}` : '1.5px solid transparent',
          '&:hover': { bgcolor: '#FFF1F2', borderColor: '#FECDD3' },
          transition: 'all 0.15s',
          userSelect: 'none',
        }}
      >
        <Box sx={{ textAlign: 'right' }}>
          <Typography sx={{ fontWeight: 600, fontSize: '13px', color: text.primary, lineHeight: 1.3 }}>
            {profile?.name || 'Admin User'}
          </Typography>
          <Typography sx={{ fontSize: '10px', color: error.dark, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {profile?.role?.replace(/_/g, ' ') || 'System Architect'}
          </Typography>
        </Box>
        <Avatar sx={{ width: 36, height: 36, bgcolor: primary?.main, fontSize: '13px', fontWeight: 700 }}>
          {initials}
        </Avatar>
        <KeyboardArrowDownRounded sx={{ fontSize: 16, color: 'grey.500', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }} />
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { width: 280, borderRadius: '12px', border: '1px solid rgba(145,158,171,0.16)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', mt: 0.5 } }}
      >
        {/* Caret */}
        <Box sx={{ width: 14, height: 14, position: 'absolute', borderBottomLeftRadius: '3.5px', clipPath: 'polygon(0% 0%, 100% 100%, 0% 100%)', border: '1px solid rgba(145,158,171,0.12)', backdropFilter: 'blur(6px)', backgroundColor: common.white, top: '-6.5px', transform: 'rotate(135deg)', right: 18 }} />

        {/* Profile header */}
        <Box sx={{ px: 2.5, pt: 2.5, pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Avatar sx={{ width: 48, height: 48, bgcolor: primary?.main, fontSize: '16px', fontWeight: 700 }}>
              {initials}
            </Avatar>
            <Box sx={{ overflow: 'hidden' }}>
              <Typography sx={{ fontWeight: 700, fontSize: '14.5px', color: '#212B36', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {profile?.name || 'Admin User'}
              </Typography>
              <Chip
                label={profile?.role?.replace(/_/g, ' ') || ''}
                size="small"
                sx={{ fontSize: '10px', fontWeight: 700, height: 20, bgcolor: '#FFF1F2', color: BRAND_RED, border: '1px solid #FECDD3', borderRadius: '6px', mt: 0.3 }}
              />
            </Box>
          </Box>

          <Stack spacing={1.2}>
            {profile?.email && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailRounded sx={{ fontSize: 15, color: 'grey.400', flexShrink: 0 }} />
                <Typography sx={{ fontSize: '12.5px', color: 'grey.700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {profile.email}
                </Typography>
              </Box>
            )}
            {profile?.employeeId && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BadgeRounded sx={{ fontSize: 15, color: 'grey.400', flexShrink: 0 }} />
                <Typography sx={{ fontSize: '12.5px', color: 'grey.700' }}>
                  {profile.employeeId}
                </Typography>
              </Box>
            )}
            {profile?.department && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WorkRounded sx={{ fontSize: 15, color: 'grey.400', flexShrink: 0 }} />
                <Typography sx={{ fontSize: '12.5px', color: 'grey.700' }}>
                  {profile.department}
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }}>
          <MenuItem
            onClick={() => { setAnchorEl(null); navigate(appnavigationpath.userprofile); }}
            sx={{ borderRadius: '8px', fontSize: 13, color: 'grey.700', gap: 1.2, py: 1 }}
          >
            <PersonRounded sx={{ fontSize: 17, color: 'grey.400' }} />
            View Profile
          </MenuItem>
          <UserLogout onLogout={onLogout} />
        </Box>
      </Popover>
    </Fragment>
  );
};

export default UserSection;