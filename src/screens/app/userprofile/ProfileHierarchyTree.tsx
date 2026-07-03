import { Avatar, Box, Chip, Typography } from '@mui/material';
import { BRAND, SURFACE } from '../../../constants/brand.constants';
import type { IUser } from '../../../types/auth.types';

interface Props {
  profile: IUser;
  allUsers: IUser[];
}

const NodeCard = ({ user }: { user: IUser }) => (
  <Box sx={{
    display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.2,
    border: `1px solid ${SURFACE.border}`, borderRadius: '10px',
    bgcolor: 'background.paper', minWidth: 200,
  }}>
    <Avatar sx={{ width: 32, height: 32, bgcolor: BRAND.red, fontSize: 13, fontWeight: 700 }}>
      {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
    </Avatar>
    <Box>
      <Typography sx={{ fontWeight: 600, fontSize: 13, color: 'grey.800', lineHeight: 1.2 }}>{user.name}</Typography>
      <Typography sx={{ fontSize: 11, color: 'grey.500' }}>{user.role.replace(/_/g, ' ')}</Typography>
    </Box>
    <Chip label={user.isActive ? 'Active' : 'Inactive'} size="small"
      sx={{ ml: 'auto', fontSize: 10, fontWeight: 700, borderRadius: '6px',
        bgcolor: user.isActive ? '#DCFCE7' : SURFACE.muted,
        color: user.isActive ? '#15803D' : '#6B7280' }} />
  </Box>
);

const ProfileHierarchyTree = ({ profile, allUsers }: Props) => {
  const directReports = allUsers.filter(u =>
    u.managerName && u.managerName.toLowerCase() === profile.name.toLowerCase() && u._id !== profile._id
  );

  return (
    <Box>
      {/* Root node */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Box sx={{ position: 'relative' }}>
          <NodeCard user={profile} />
          <Chip label="You" size="small" sx={{
            position: 'absolute', top: -10, right: -10, fontSize: 10,
            fontWeight: 700, bgcolor: BRAND.redBg, color: BRAND.red,
            border: `1px solid ${BRAND.redBorder}`, borderRadius: '6px',
          }} />
        </Box>
      </Box>

      {directReports.length > 0 ? (
        <>
          {/* Connector line */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: 2, height: 24, bgcolor: SURFACE.border }} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ borderTop: `2px solid ${SURFACE.border}`, width: Math.min(directReports.length * 220, 880) }} />
          </Box>

          {/* Report nodes */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', mt: 0 }}>
            {directReports.map(u => (
              <Box key={u._id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                <Box sx={{ width: 2, height: 20, bgcolor: SURFACE.border }} />
                <NodeCard user={u} />
              </Box>
            ))}
          </Box>
        </>
      ) : (
        <Typography sx={{ textAlign: 'center', color: 'grey.400', fontSize: 13, mt: 1 }}>
          No direct reports found.
        </Typography>
      )}
    </Box>
  );
};

export default ProfileHierarchyTree;
