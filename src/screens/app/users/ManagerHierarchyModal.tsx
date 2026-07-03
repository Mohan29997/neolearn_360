import { Box, Typography, Avatar, IconButton, Button, Chip } from '@mui/material';
import {
  CloseRounded, EmailRounded, NavigateNextRounded,
  FileDownloadRounded, TuneRounded,
} from '@mui/icons-material';
import type { IUser } from '../../../types/auth.types';
import { hierarchyStyles as s } from './ManagerHierarchy.styles';
import { BRAND } from '../../../constants/brand.constants';

interface Props {
  subject: IUser;
  allUsers: IUser[];
  onClose: () => void;
}

function initials(name: string) {
  return (name ?? '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

const AVATAR_COLORS = [
  '#4F7FD4', '#D4724A', '#4FAD75', '#9B5BD4', '#D4A84A',
  '#4BBFD4', '#D44B8A', '#6FD44B', '#D46A4B', '#4B8FD4',
];

function avatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

const CARD_W = 240;
const GAP = 20;

/* ── section label between tiers ── */
function TierLabel({ label }: { label: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, my: 0.5, width: '100%', justifyContent: 'center' }}>
      <Box sx={{ flex: 1, maxWidth: 120, height: 1, background: 'rgba(139,26,46,0.2)', borderRadius: 1 }} />
      <Typography sx={{
        fontSize: 10, fontWeight: 800, color: BRAND.red,
        letterSpacing: 1.5, textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}>
        {label}
      </Typography>
      <Box sx={{ flex: 1, maxWidth: 120, height: 1, background: 'rgba(139,26,46,0.2)', borderRadius: 1 }} />
    </Box>
  );
}

/* ── user card ── */
function UserCard({
  user,
  isTop = false,
  highlighted = false,
  size = 'md',
  department,
  managerLabel,
}: {
  user: IUser;
  isTop?: boolean;
  highlighted?: boolean;
  size?: 'lg' | 'md' | 'sm';
  department?: string;
  managerLabel?: string;
}) {
  const w = isTop ? 320 : size === 'sm' ? 220 : CARD_W;
  const avSize = isTop ? 96 : size === 'sm' ? 60 : 72;
  const avFs = isTop ? 34 : size === 'sm' ? 22 : 26;
  const nameFs = isTop ? 20 : size === 'sm' ? 14 : 16;

  return (
    <Box sx={{
      background: '#fff',
      border: `${isTop || highlighted ? 2 : 1.5}px solid`,
      borderColor: isTop || highlighted ? BRAND.red : 'grey.200',
      borderRadius: '16px',
      p: isTop ? '28px 32px' : size === 'sm' ? '18px 20px' : '20px 24px',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      width: w, flexShrink: 0,
      boxShadow: isTop
        ? `0 6px 28px rgba(139,26,46,0.13)`
        : highlighted
          ? `0 4px 18px rgba(139,26,46,0.14)`
          : '0 2px 8px rgba(0,0,0,0.06)',
    }}>
      <Avatar sx={{
        width: avSize, height: avSize, fontSize: avFs, fontWeight: 800,
        background: isTop
          ? `linear-gradient(135deg, ${BRAND.red}, ${BRAND.redHover})`
          : avatarColor(user.name),
        color: '#fff', mb: 1,
      }}>
        {initials(user.name)}
      </Avatar>
      <Typography sx={{ fontWeight: 800, fontSize: nameFs, color: 'grey.900', textAlign: 'center', lineHeight: 1.2 }}>
        {user.name}
      </Typography>
      <Typography sx={{
        fontWeight: 700, fontSize: 11, color: BRAND.red,
        letterSpacing: 1, textAlign: 'center', mt: 0.4, textTransform: 'uppercase',
      }}>
        {user.role}
      </Typography>
      {department && (
        <Chip label={department} size="small" sx={{
          mt: 0.8, fontSize: 10, fontWeight: 600, bgcolor: '#F0FDF4', color: '#15803D',
          border: '1px solid #BBF7D0', borderRadius: '6px',
        }} />
      )}
      <Box sx={{ width: '85%', borderTop: '1px solid', borderColor: 'grey.200', my: 1.4 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, width: '100%' }}>
        <EmailRounded sx={{ fontSize: 13, color: 'grey.400', flexShrink: 0 }} />
        <Typography sx={{ fontSize: 12, color: 'grey.500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user.email}
        </Typography>
      </Box>
      {managerLabel && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, width: '100%', mt: 0.6 }}>
          <Box sx={{ width: 13, height: 13, borderRadius: '50%', bgcolor: BRAND.redBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: BRAND.red }} />
          </Box>
          <Typography sx={{ fontSize: 11, color: 'grey.500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            Reports to: <strong>{managerLabel}</strong>
          </Typography>
        </Box>
      )}
    </Box>
  );
}

function VLine({ height = 36 }: { height?: number }) {
  return <Box sx={{ width: 2, height, background: 'rgba(139,26,46,0.4)', borderRadius: 2, flexShrink: 0 }} />;
}

function HConnector({ count, cardW = CARD_W, gap = GAP }: { count: number; cardW?: number; gap?: number }) {
  if (count === 1) return <VLine />;
  const barW = (count - 1) * (cardW + gap);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <VLine />
      <Box sx={{ position: 'relative', width: barW, height: 2, background: 'rgba(139,26,46,0.4)', borderRadius: 2 }}>
        {Array.from({ length: count }).map((_, i) => (
          <Box key={i} sx={{
            position: 'absolute',
            left: i * (cardW + gap) + cardW / 2 - 1,
            top: 0, width: 2, height: 30,
            background: 'rgba(139,26,46,0.4)', borderRadius: 2,
          }} />
        ))}
      </Box>
    </Box>
  );
}

/* ── VP tree: VP → DMs (with sub-dept badge) → their managers ── */
function VPTree({ vp, allUsers }: { vp: IUser; allUsers: IUser[] }) {
  const dms = allUsers.filter(
    u => u.managerName?.toLowerCase() === vp.name.toLowerCase() && u._id !== vp._id,
  );
  const vpManager = vp.managerName
    ? allUsers.find(u => u.name.toLowerCase() === vp.managerName!.toLowerCase())
    : null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <UserCard
        user={vp}
        isTop
        department={vp.department}
        managerLabel={vpManager?.name ?? vp.managerName}
      />

      {dms.length === 0 ? (
        <Typography sx={{ color: 'grey.400', fontSize: 13, mt: 3 }}>No DMs found under this VP.</Typography>
      ) : (
        <>
          <TierLabel label="DM" />
          <HConnector count={dms.length} cardW={CARD_W} gap={GAP} />
          <Box sx={{ display: 'flex', gap: `${GAP}px`, justifyContent: 'center', flexWrap: 'nowrap', alignItems: 'flex-start' }}>
            {dms.map(dm => {
              const managers = allUsers.filter(
                u => u.managerName?.toLowerCase() === dm.name.toLowerCase() && u._id !== dm._id,
              );
              return (
                <Box key={dm._id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: CARD_W }}>
                  <Box sx={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <UserCard user={dm} highlighted department={dm.department} />
                    {dm.subDepartment && (
                      <Chip label={dm.subDepartment} size="small" sx={{
                        position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                        fontSize: 10, fontWeight: 700, bgcolor: '#EFF6FF', color: '#2563EB',
                        border: '1px solid #BFDBFE', borderRadius: '6px',
                      }} />
                    )}
                  </Box>
                  {managers.length > 0 && (
                    <>
                      <TierLabel label="Manager" />
                      <HConnector count={managers.length} cardW={Math.min(CARD_W - 20, 200)} gap={10} />
                      <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {managers.map(m => <UserCard key={m._id} user={m} size="sm" managerLabel={m.managerName} />)}
                      </Box>
                    </>
                  )}
                </Box>
              );
            })}
          </Box>
        </>
      )}
    </Box>
  );
}

/* ── DM tree: VP → DM → managers (with sub-dept badge on DM) ── */
function DMTree({ dm, allUsers }: { dm: IUser; allUsers: IUser[] }) {
  const vp = dm.managerName ? allUsers.find(u => u.name.toLowerCase() === dm.managerName!.toLowerCase()) ?? null : null;
  const managers = allUsers.filter(
    u => u.managerName?.toLowerCase() === dm.name.toLowerCase() && u._id !== dm._id,
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      {vp && (
        <>
          <UserCard user={vp} isTop />
          <VLine />
        </>
      )}
      <TierLabel label="DM" />
      <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
        <UserCard user={dm} highlighted={!!vp} isTop={!vp} />
        {dm.subDepartment && (
          <Chip label={dm.subDepartment} size="small" sx={{
            position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
            fontSize: 10, fontWeight: 700, bgcolor: '#EFF6FF', color: '#2563EB',
            border: '1px solid #BFDBFE', borderRadius: '6px',
          }} />
        )}
      </Box>
      {managers.length > 0 && (
        <>
          <TierLabel label="Manager" />
          <HConnector count={managers.length} />
          <Box sx={{ display: 'flex', gap: `${GAP}px`, justifyContent: 'center', flexWrap: 'nowrap' }}>
            {managers.map(m => <UserCard key={m._id} user={m} />)}
          </Box>
        </>
      )}
    </Box>
  );
}

/* ── super admin full tree ── */
function SuperAdminTree({ superAdmin, allUsers }: { superAdmin: IUser; allUsers: IUser[] }) {
  const managers = allUsers.filter(
    u => u.managerName && u.managerName.toLowerCase() === superAdmin.name.toLowerCase() && u._id !== superAdmin._id,
  );

  if (managers.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <UserCard user={superAdmin} isTop />
        <Typography sx={{ color: 'grey.400', fontSize: 13, mt: 3 }}>No managers found under this admin.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>

      {/* tier 1 — super admin */}
      <UserCard user={superAdmin} isTop />

      {/* label + connector to managers */}
      <TierLabel label="Manager" />
      <HConnector count={managers.length} cardW={CARD_W} gap={GAP} />

      {/* tier 2 — managers row (cards only, aligned by connector) */}
      <Box sx={{ display: 'flex', gap: `${GAP}px`, justifyContent: 'center', flexWrap: 'nowrap' }}>
        {managers.map(mgr => (
          <Box key={mgr._id} sx={{ width: CARD_W, display: 'flex', justifyContent: 'center' }}>
            <UserCard user={mgr} highlighted />
          </Box>
        ))}
      </Box>

      {/* label + connector to employees (one row spanning all managers' teams) */}
      {managers.some(m => allUsers.some(u => u.managerName?.toLowerCase() === m.name.toLowerCase() && u._id !== m._id)) && (
        <>
          <TierLabel label="Team" />
          {/* per-manager employee columns */}
          <Box sx={{ display: 'flex', gap: `${GAP}px`, justifyContent: 'center', flexWrap: 'nowrap', alignItems: 'flex-start' }}>
            {managers.map(mgr => {
              const employees = allUsers.filter(
                u => u.managerName && u.managerName.toLowerCase() === mgr.name.toLowerCase() && u._id !== mgr._id,
              );
              return (
                <Box key={mgr._id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: CARD_W }}>
                  {employees.length > 0 ? (
                    <>
                      <HConnector count={employees.length} cardW={Math.min(CARD_W - 20, 200)} gap={10} />
                      <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {employees.map(e => (
                          <UserCard key={e._id} user={e} size="sm" />
                        ))}
                      </Box>
                    </>
                  ) : (
                    <Typography sx={{ fontSize: 11, color: 'grey.300', mt: 1 }}>—</Typography>
                  )}
                </Box>
              );
            })}
          </Box>
        </>
      )}
    </Box>
  );
}

const ManagerHierarchyModal = ({ subject, allUsers, onClose }: Props) => {
  const role = subject.role.toUpperCase();

  const department = subject.department ?? 'N/A';

  /* ── find super admin for non-super-admin subjects ── */
  const findSuperAdmin = (user: IUser): IUser | null => {
    if (user.managerName) {
      const parent = allUsers.find(u => u.name.toLowerCase() === user.managerName!.toLowerCase()) ?? null;
      if (parent && parent.role.toUpperCase() === 'SUPER_ADMIN') return parent;
      if (parent) return findSuperAdmin(parent);
    }
    return allUsers.find(u => u.role.toUpperCase() === 'SUPER_ADMIN') ?? null;
  };

  /* ── stats helpers ── */
  const getStats = () => {
    if (role === 'SUPER_ADMIN') {
      const managers = allUsers.filter(u => u.managerName?.toLowerCase() === subject.name.toLowerCase());
      const employees = allUsers.filter(u =>
        managers.some(m => u.managerName?.toLowerCase() === m.name.toLowerCase()),
      );
      const all = [subject, ...managers, ...employees];
      return { total: all.length, active: all.filter(u => u.isActive).length, tiers: 3 };
    }
    if (role === 'VP') {
      const dms = allUsers.filter(u => u.managerName?.toLowerCase() === subject.name.toLowerCase());
      const managers = allUsers.filter(u => dms.some(d => u.managerName?.toLowerCase() === d.name.toLowerCase()));
      const all = [subject, ...dms, ...managers];
      return { total: all.length, active: all.filter(u => u.isActive).length, tiers: 3 };
    }
    if (role === 'DM') {
      const vp = subject.managerName ? allUsers.find(u => u.name.toLowerCase() === subject.managerName!.toLowerCase()) : null;
      const managers = allUsers.filter(u => u.managerName?.toLowerCase() === subject.name.toLowerCase() && u._id !== subject._id);
      const all = [vp, subject, ...managers].filter(Boolean) as IUser[];
      return { total: all.length, active: all.filter(u => u.isActive).length, tiers: vp ? 3 : 2 };
    }
    if (role === 'MANAGER' || role === 'ADMIN') {
      const reports = allUsers.filter(u => u.managerName?.toLowerCase() === subject.name.toLowerCase() && u._id !== subject._id);
      const sa = findSuperAdmin(subject);
      const all = [sa, subject, ...reports].filter(Boolean) as IUser[];
      return { total: all.length, active: all.filter(u => u.isActive).length, tiers: sa ? 3 : 2 };
    }
    const mgr = subject.managerName ? allUsers.find(u => u.name.toLowerCase() === subject.managerName!.toLowerCase()) : null;
    const all = [mgr, subject].filter(Boolean) as IUser[];
    return { total: all.length, active: all.filter(u => u.isActive).length, tiers: mgr ? 2 : 1 };
  };

  const stats = getStats();

  return (
    <Box sx={s.overlay} onClick={onClose}>
      <Box sx={s.container} onClick={(e: React.MouseEvent) => e.stopPropagation()}>

        {/* Top bar */}
        <Box sx={s.topBar}>
          <Box sx={s.breadcrumb}>
            <Typography sx={s.breadcrumbText}>Users</Typography>
            <NavigateNextRounded sx={{ fontSize: 16, color: 'grey.400', mx: 0.2 }} />
            <Typography sx={s.breadcrumbActive}>Manager Hierarchy</Typography>
          </Box>
          <IconButton size="small" onClick={onClose} sx={{ color: 'grey.500' }}>
            <CloseRounded />
          </IconButton>
        </Box>

        {/* Header */}
        <Box sx={s.header}>
          <Box>
            <Typography sx={s.title}>Organization Hierarchy</Typography>
            <Typography sx={s.subtitle}>Visualizing reporting lines for the {department} Department</Typography>
          </Box>
          <Box sx={s.headerBtns}>
            <Button variant="outlined" startIcon={<FileDownloadRounded />} sx={s.exportBtn}>Export PDF</Button>
            <Button variant="contained" startIcon={<TuneRounded />} sx={s.adjustBtn}>Adjust View</Button>
          </Box>
        </Box>

        {/* Tree body */}
        <Box sx={s.treeBody}>
          <Box sx={s.treeInner}>

            {/* ── SUPER ADMIN: full tree ── */}
            {role === 'SUPER_ADMIN' && (
              <SuperAdminTree superAdmin={subject} allUsers={allUsers} />
            )}

            {/* ── VP: VP → DMs (with sub-dept) → managers ── */}
            {role === 'VP' && <VPTree vp={subject} allUsers={allUsers} />}

            {/* ── DM: VP → DM (with sub-dept) → managers ── */}
            {role === 'DM' && <DMTree dm={subject} allUsers={allUsers} />}

            {/* ── MANAGER: super admin → manager → team ── */}
            {(role === 'MANAGER' || role === 'ADMIN') && (() => {
              const sa = findSuperAdmin(subject);
              const employees = allUsers.filter(
                u => u.managerName?.toLowerCase() === subject.name.toLowerCase() && u._id !== subject._id,
              );
              return (
                <>
                  {sa && (
                    <>
                      <UserCard user={sa} isTop />
                      <VLine />
                    </>
                  )}
                  <TierLabel label="Manager" />
                  <UserCard user={subject} isTop={!sa} highlighted={!!sa} />
                  {employees.length > 0 && (
                    <>
                      <TierLabel label="Team" />
                      <HConnector count={employees.length} />
                      <Box sx={{ display: 'flex', gap: `${GAP}px`, justifyContent: 'center', flexWrap: 'nowrap' }}>
                        {employees.map(e => <UserCard key={e._id} user={e} />)}
                      </Box>
                    </>
                  )}
                </>
              );
            })()}

            {/* ── EMPLOYEE: manager → employee only ── */}
            {role === 'EMPLOYEE' && (() => {
              const mgr = subject.managerName
                ? allUsers.find(u => u.name.toLowerCase() === subject.managerName!.toLowerCase()) ?? null
                : null;
              return (
                <>
                  {mgr ? (
                    <>
                      <UserCard user={mgr} isTop />
                      <TierLabel label="Employee" />
                      <VLine />
                      <UserCard user={subject} highlighted />
                    </>
                  ) : (
                    <UserCard user={subject} isTop highlighted />
                  )}
                </>
              );
            })()}

          </Box>
        </Box>

        {/* Stats footer */}
        <Box sx={s.statsFooter}>
          <Box sx={s.statCard}>
            <Typography sx={s.statLabel}>Total Team Size</Typography>
            <Typography sx={s.statValueRed}>{stats.total} Members</Typography>
          </Box>
          <Box sx={s.statCard}>
            <Typography sx={s.statLabel}>Reporting Levels</Typography>
            <Typography sx={s.statValue}>{stats.tiers} Tiers</Typography>
          </Box>
          <Box sx={s.statCard}>
            <Typography sx={s.statLabel}>Department</Typography>
            <Typography sx={s.statValue}>{department}</Typography>
          </Box>
          <Box sx={s.statCard}>
            <Typography sx={s.statLabel}>Active Members</Typography>
            <Typography sx={s.statValueRed}>{stats.active}</Typography>
          </Box>
        </Box>

      </Box>
    </Box>
  );
};

export default ManagerHierarchyModal;
