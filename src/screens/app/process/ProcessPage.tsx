import { Fragment, useState } from 'react';
import {
  Box, Button, Card, Chip, Collapse, Dialog, FormControl, InputBase,
  MenuItem, Select, Typography, IconButton, Divider,
} from '@mui/material';
import {
  AddRounded, AssignmentIndRounded, CheckRounded, CloseRounded,
  EmojiEventsRounded, FactCheckRounded, FeedbackRounded,
  GroupsRounded, PersonRounded, RouteRounded, TuneRounded,
} from '@mui/icons-material';
import TabTitle from '../../../components/tabtitle';
import { useMUITheme } from '../../../hooks/useMUITheme';
import { useProcess } from '../../../features/process/hooks/useProcess';
import { STATUS_CHIP_STYLES } from './Process.styles';
import RnrTrack from './RnrTrack';
import { BRAND, SURFACE } from '../../../constants/brand.constants';
import type { IProcess, ProcessApprovalStatus, ProcessType } from './Process.types';

const B = SURFACE.border;

const PROCESS_TYPES: {
  type: ProcessType;
  label: string;
  sub: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  border: string;
}[] = [
  { type: 'meeting',      label: 'Meeting',      sub: 'Team or stakeholder meeting',   icon: <GroupsRounded sx={{ fontSize: 22 }} />,       color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
  { type: 'client_visit', label: 'Client Visit',  sub: 'On-site or virtual client visit', icon: <RouteRounded sx={{ fontSize: 22 }} />,        color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
  { type: 'feedback',     label: 'Feedback',      sub: 'Collect structured feedback',   icon: <FeedbackRounded sx={{ fontSize: 22 }} />,     color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
  { type: 'rnr',          label: 'RnR',           sub: 'Rewards & Recognition',         icon: <EmojiEventsRounded sx={{ fontSize: 22 }} />,  color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' },
  { type: 'custom',       label: 'Custom',        sub: 'Define your own process',       icon: <TuneRounded sx={{ fontSize: 22 }} />,         color: BRAND.red,  bg: BRAND.redBg, border: BRAND.redBorder },
];

const TYPE_LABELS: Record<ProcessType, { color: string; bg: string; border: string }> = {
  meeting:      { color: '#2563EB', bg: '#EFF6FF',    border: '#BFDBFE' },
  client_visit: { color: '#7C3AED', bg: '#F5F3FF',    border: '#DDD6FE' },
  feedback:     { color: '#D97706', bg: '#FFFBEB',    border: '#FDE68A' },
  rnr:          { color: '#16A34A', bg: '#F0FDF4',    border: '#BBF7D0' },
  custom:       { color: BRAND.red,  bg: BRAND.redBg, border: BRAND.redBorder },
};

const TYPE_DISPLAY: Record<ProcessType, string> = {
  meeting: 'Meeting', client_visit: 'Client Visit', feedback: 'Feedback', rnr: 'RnR', custom: 'Custom',
};

const FL = ({ children }: { children: string }) => (
  <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'grey.500', textTransform: 'uppercase', letterSpacing: 0.5, mb: 0.6 }}>
    {children}
  </Typography>
);

const inputSx = {
  display: 'flex', alignItems: 'center',
  border: `1.5px solid ${B}`, borderRadius: '10px',
  px: 1.5, py: '9px', background: '#FAFAFA',
  transition: 'border-color 0.18s, background 0.18s',
  '&:focus-within': { borderColor: BRAND.red, background: '#fff', boxShadow: `0 0 0 3px ${BRAND.redBg}` },
};

const selectSx = {
  borderRadius: '10px', fontSize: '13.5px', background: '#FAFAFA',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: B },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: BRAND.red },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: BRAND.red },
};

const overallStatus = (p: IProcess): ProcessApprovalStatus => {
  if (p.type === 'rnr') {
    const winners = p.rnrWinners || [];
    if (winners.length > 0 && winners.every(w => w.status === 'decided')) return 'approved';
    return 'pending';
  }
  if (p.dmStatus === 'rejected' || p.tlStatus === 'rejected') return 'rejected';
  if (p.dmStatus === 'approved' && p.tlStatus === 'approved') return 'approved';
  return 'pending';
};

const ProcessPage = () => {
  const { palette: { grey } } = useMUITheme();
  const [rnrModalId, setRnrModalId] = useState<string | null>(null);

  const {
    processes, assignees, dmUsers, tlUsers, loadingUsers,
    formOpen, setFormOpen,
    processType, handleTypeSelect,
    name, setName, category, setCategory, description, setDescription,
    assigneeId, setAssigneeId, dmId, setDmId, tlId, setTlId,
    isSubmitting, isValid, isTypeSelected, isRnr,
    handleCreateProcess, resetForm, setApproval,
    nominateTeamMember, pickDeptNominee, decideDeptWinner,
  } = useProcess();

  const handleClose = () => { resetForm(); setFormOpen(false); };

  const ReviewerPill = ({
    label, name: rName, status, accent, onApprove, onReject,
  }: {
    label: string; name: string; status: ProcessApprovalStatus;
    accent?: string; onApprove: () => void; onReject: () => void;
  }) => (
    <Box sx={{
      display: 'flex', alignItems: 'center', gap: 1.2,
      px: 1.8, py: 1.3, borderRadius: '12px', flex: 1, minWidth: 190,
      border: `1.5px solid ${B}`, bgcolor: SURFACE.rowHeader,
      transition: 'border-color 0.18s, box-shadow 0.18s, transform 0.18s',
      '&:hover': { borderColor: accent ?? BRAND.red, boxShadow: `0 0 0 3px ${BRAND.redBg}`, transform: 'translateY(-1px)' },
    }}>
      <Box sx={{
        width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
        bgcolor: accent ? `${accent}18` : grey[100], color: accent ?? BRAND.red,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 800, fontSize: '0.78rem',
      }}>
        {rName ? rName.slice(0, 2).toUpperCase() : <PersonRounded sx={{ fontSize: 16 }} />}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: '0.63rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'grey.400' }}>{label}</Typography>
        <Typography sx={{ fontWeight: 600, fontSize: '0.88rem', color: 'grey.800', lineHeight: 1.3 }} noWrap>{rName || 'Unassigned'}</Typography>
      </Box>
      {status === 'pending' ? (
        <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
          <Button size="small" variant="outlined" startIcon={<CheckRounded sx={{ fontSize: 12 }} />} onClick={onApprove}
            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '7px', fontSize: '0.72rem', minWidth: 'unset', px: 1.3, py: 0.4, color: '#16A34A', borderColor: '#BBF7D0', transition: 'all 0.15s', '&:hover': { borderColor: '#16A34A', bgcolor: '#F0FDF4', transform: 'scale(1.06)' } }}>
            Approve
          </Button>
          <Button size="small" variant="outlined" startIcon={<CloseRounded sx={{ fontSize: 12 }} />} onClick={onReject}
            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '7px', fontSize: '0.72rem', minWidth: 'unset', px: 1.3, py: 0.4, color: '#DC2626', borderColor: '#FECACA', transition: 'all 0.15s', '&:hover': { borderColor: '#DC2626', bgcolor: '#FEF2F2', transform: 'scale(1.06)' } }}>
            Reject
          </Button>
        </Box>
      ) : (
        <Chip label={status} size="small" variant="outlined"
          sx={{ ...STATUS_CHIP_STYLES[status], fontWeight: 700, textTransform: 'capitalize', flexShrink: 0 }} />
      )}
    </Box>
  );

  return (
    <Fragment>
      <TabTitle title="Process" />
      <Box sx={{ p: { xs: 2, sm: 4 }, bgcolor: SURFACE.page, minHeight: '100vh' }}>

        {/* ── Header ── */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 38, height: 38, borderRadius: '10px', bgcolor: BRAND.redBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AssignmentIndRounded sx={{ color: BRAND.red, fontSize: 20 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'grey.900' }}>Process</Typography>
          </Box>
          <Button
            size="small"
            variant="contained"
            startIcon={<AddRounded sx={{ fontSize: 13 }} />}
            onClick={() => setFormOpen(true)}
            disabled={formOpen}
            sx={{
              bgcolor: BRAND.red, color: '#fff', textTransform: 'none', fontWeight: 700,
              borderRadius: '8px', px: 1, py: 0.4, fontSize: 11.5, minWidth: 'unset',
              width: 'fit-content', minHeight: 'unset', lineHeight: 1.4,
              whiteSpace: 'nowrap', flexShrink: 0, boxShadow: 'none',
              transition: 'all 0.2s',
              '& .MuiButton-startIcon': { mr: 0.4, ml: 0 },
              '&:hover': { bgcolor: BRAND.redHover, transform: 'translateY(-1px)', boxShadow: `0 6px 20px rgba(139,26,46,0.28)` },
              '&:active': { transform: 'translateY(0)' },
              '&.Mui-disabled': { bgcolor: BRAND.red, opacity: 0.45, color: '#fff' },
            }}>
            New Process
          </Button>
        </Box>

        {/* ── Inline Form ── */}
        <Collapse in={formOpen} timeout={320} unmountOnExit>
          <Card sx={{ borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', border: `1.5px solid ${BRAND.redBorder}`, mb: 3, overflow: 'hidden' }}>
            {/* Form header */}
            <Box sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              px: 3, py: 2.5,
              background: `linear-gradient(135deg, ${BRAND.redBg} 0%, #fff 70%)`,
              borderBottom: `1px solid ${B}`,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 36, height: 36, borderRadius: '8px', bgcolor: '#fff', border: `1px solid ${BRAND.redBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AssignmentIndRounded sx={{ color: BRAND.red, fontSize: 18 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: 16, color: 'grey.900' }}>New Process</Typography>
                  <Typography sx={{ fontSize: 12, color: 'grey.500' }}>Select a process type to get started</Typography>
                </Box>
              </Box>
              <IconButton size="small" onClick={handleClose}
                sx={{ transition: 'all 0.18s', '&:hover': { bgcolor: BRAND.redBg, color: BRAND.red, transform: 'rotate(90deg)' } }}>
                <CloseRounded fontSize="small" />
              </IconButton>
            </Box>

            <Box sx={{ p: 3 }}>
              {/* ── Step 1: Type picker ── */}
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: BRAND.red, textTransform: 'uppercase', letterSpacing: 1, mb: 2 }}>
                Select Process Type
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(5, 1fr)' }, gap: 1.5, mb: 3 }}>
                {PROCESS_TYPES.map(pt => {
                  const selected = processType === pt.type;
                  return (
                    <Box
                      key={pt.type}
                      onClick={() => handleTypeSelect(pt.type)}
                      sx={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        gap: 1, p: 2, borderRadius: '12px', cursor: 'pointer', textAlign: 'center',
                        border: `2px solid ${selected ? pt.color : B}`,
                        bgcolor: selected ? pt.bg : '#fff',
                        transition: 'all 0.18s',
                        '&:hover': { borderColor: pt.color, bgcolor: pt.bg, transform: 'translateY(-2px)', boxShadow: `0 4px 14px ${pt.bg}` },
                      }}>
                      <Box sx={{ color: selected ? pt.color : 'grey.400', transition: 'color 0.18s' }}>{pt.icon}</Box>
                      <Typography sx={{ fontWeight: 700, fontSize: 12.5, color: selected ? pt.color : 'grey.700', lineHeight: 1.2 }}>{pt.label}</Typography>
                      <Typography sx={{ fontSize: 10.5, color: 'grey.400', lineHeight: 1.3 }}>{pt.sub}</Typography>
                    </Box>
                  );
                })}
              </Box>

              {/* ── Step 2: Details (shown after type selected) ── */}
              <Collapse in={isTypeSelected} timeout={260} unmountOnExit>
                <Divider sx={{ mb: 3 }} />
                <Typography sx={{ fontSize: 11, fontWeight: 700, color: BRAND.red, textTransform: 'uppercase', letterSpacing: 1, mb: 2 }}>
                  Process Details
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
                  <Box>
                    <FL>Process Name</FL>
                    <Box sx={inputSx}>
                      <InputBase fullWidth placeholder="e.g. Weekly Bench Sync" value={name}
                        onChange={e => setName(e.target.value)} sx={{ fontSize: '13.5px' }} />
                    </Box>
                  </Box>
                  <Box>
                    <FL>Category</FL>
                    <Box sx={inputSx}>
                      <InputBase fullWidth placeholder="e.g. Meeting" value={category}
                        onChange={e => setCategory(e.target.value)} sx={{ fontSize: '13.5px' }} />
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <FL>Description</FL>
                  <Box sx={{ ...inputSx, alignItems: 'flex-start', py: 1.2 }}>
                    <InputBase fullWidth multiline minRows={3}
                      placeholder="Describe the purpose and steps of this process..."
                      value={description} onChange={e => setDescription(e.target.value)} sx={{ fontSize: '13.5px' }} />
                  </Box>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {isRnr ? (
                  <Box sx={{
                    display: 'flex', alignItems: 'center', gap: 1.5, mb: 3,
                    p: 2, borderRadius: '10px', bgcolor: BRAND.redBg, border: `1px solid ${BRAND.redBorder}`,
                  }}>
                    <EmojiEventsRounded sx={{ color: BRAND.red, fontSize: 22, flexShrink: 0 }} />
                    <Typography sx={{ fontSize: 13, color: 'grey.700', lineHeight: 1.5 }}>
                      All <strong>{tlUsers.length}</strong> Team Leads will be auto-assigned to nominate one member from
                      their own team. Each department's DM then advances one nominee, and the department VP declares
                      the final Rewards &amp; Recognition winner.
                    </Typography>
                  </Box>
                ) : (
                  <Fragment>
                    <Typography sx={{ fontSize: 11, fontWeight: 700, color: BRAND.red, textTransform: 'uppercase', letterSpacing: 1, mb: 2 }}>
                      Assignee &amp; Reviewers
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
                      <Box>
                        <FL>Assignee</FL>
                        <FormControl fullWidth size="small">
                          <Select displayEmpty value={assigneeId} disabled={loadingUsers}
                            onChange={e => setAssigneeId(e.target.value)} sx={selectSx}
                            renderValue={v => v ? (assignees.find(u => u._id === v)?.name ?? '') : <Typography sx={{ color: 'grey.400', fontSize: '13.5px' }}>Select assignee</Typography>}>
                            {assignees.map(u => <MenuItem key={u._id} value={u._id}>{u.name}</MenuItem>)}
                          </Select>
                        </FormControl>
                      </Box>
                      <Box>
                        <FL>DM (Delivery Manager)</FL>
                        <FormControl fullWidth size="small">
                          <Select displayEmpty value={dmId} disabled={loadingUsers}
                            onChange={e => setDmId(e.target.value)} sx={selectSx}
                            renderValue={v => v ? (dmUsers.find(u => u._id === v)?.name ?? '') : <Typography sx={{ color: 'grey.400', fontSize: '13.5px' }}>Select DM</Typography>}>
                            {dmUsers.length === 0 ? <MenuItem disabled>No DMs found</MenuItem>
                              : dmUsers.map(u => <MenuItem key={u._id} value={u._id}>{u.name}</MenuItem>)}
                          </Select>
                        </FormControl>
                      </Box>
                      <Box>
                        <FL>TL (Team Lead)</FL>
                        <FormControl fullWidth size="small">
                          <Select displayEmpty value={tlId} disabled={loadingUsers}
                            onChange={e => setTlId(e.target.value)} sx={selectSx}
                            renderValue={v => v ? (tlUsers.find(u => u._id === v)?.name ?? '') : <Typography sx={{ color: 'grey.400', fontSize: '13.5px' }}>Select TL</Typography>}>
                            {tlUsers.length === 0 ? <MenuItem disabled>No TLs found</MenuItem>
                              : tlUsers.map(u => <MenuItem key={u._id} value={u._id}>{u.name}</MenuItem>)}
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>
                  </Fragment>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, pt: 2, borderTop: `1px solid ${B}` }}>
                  <Button onClick={handleClose}
                    sx={{ textTransform: 'none', fontWeight: 600, color: 'grey.600', fontSize: 13, borderRadius: '8px', '&:hover': { bgcolor: SURFACE.muted } }}>
                    Cancel
                  </Button>
                  <Button variant="contained" disabled={!isValid || isSubmitting} onClick={handleCreateProcess}
                    sx={{
                      textTransform: 'none', fontWeight: 600, fontSize: 13, borderRadius: '8px',
                      bgcolor: BRAND.red, px: 3.5, boxShadow: 'none', transition: 'all 0.2s',
                      '&:hover': { bgcolor: BRAND.redHover, boxShadow: `0 4px 14px rgba(139,26,46,0.3)`, transform: 'translateY(-1px)' },
                      '&:active': { transform: 'translateY(0)' },
                      '&.Mui-disabled': { bgcolor: 'grey.200', color: 'grey.400' },
                    }}>
                    {isSubmitting ? 'Creating...' : 'Create Process'}
                  </Button>
                </Box>
              </Collapse>
            </Box>
          </Card>
        </Collapse>

        {/* ── Process List ── */}
        {processes.length === 0 ? (
          <Card sx={{
            borderRadius: '16px', boxShadow: 'none', border: `1px solid ${B}`,
            p: { xs: 5, sm: 8 }, textAlign: 'center',
            background: `linear-gradient(145deg, ${BRAND.redBg} 0%, #fff 55%)`,
            '@keyframes fadeUp': { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
            animation: 'fadeUp 0.4s ease',
          }}>
            <Box sx={{ width: 72, height: 72, borderRadius: '20px', bgcolor: '#fff', border: `1.5px solid ${BRAND.redBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2.5, boxShadow: `0 4px 20px ${BRAND.redBg}` }}>
              <FactCheckRounded sx={{ fontSize: 34, color: BRAND.red }} />
            </Box>
            <Typography sx={{ fontWeight: 800, fontSize: 18, color: 'grey.800', mb: 0.8 }}>No processes yet</Typography>
            <Typography sx={{ color: 'grey.500', fontSize: 13.5, maxWidth: 360, mx: 'auto' }}>
              Click "New Process" to create one and route it for DM &amp; TL approval.
            </Typography>
          </Card>
        ) : (
          processes.map((process, idx) => {
            const status = overallStatus(process);
            const tl = TYPE_LABELS[process.type] ?? TYPE_LABELS.custom;
            return (
              <Card key={process.id} sx={{
                borderRadius: '14px', boxShadow: 'none',
                border: `1.5px solid ${status === 'approved' ? '#BBF7D0' : status === 'rejected' ? '#FECACA' : B}`,
                p: 0, mb: 2, overflow: 'hidden',
                transition: 'box-shadow 0.2s, transform 0.2s',
                '&:hover': { boxShadow: '0 6px 24px rgba(0,0,0,0.09)', transform: 'translateY(-1px)' },
                '@keyframes cardIn': { from: { opacity: 0, transform: 'translateY(14px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
                animation: `cardIn 0.3s ease ${idx * 0.06}s both`,
              }}>
                <Box sx={{ height: 3, bgcolor: status === 'approved' ? '#16A34A' : status === 'rejected' ? '#DC2626' : BRAND.red }} />
                <Box sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap', mb: 1.5 }}>
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: 16, color: 'grey.900', mb: 0.5 }}>{process.name}</Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                          label={TYPE_DISPLAY[process.type]}
                          size="small"
                          sx={{ fontWeight: 700, fontSize: '0.68rem', bgcolor: tl.bg, color: tl.color, border: `1px solid ${tl.border}`, borderRadius: '6px' }}
                        />
                        <Chip
                          label={`Created ${new Date(process.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}`}
                          size="small"
                          sx={{ fontSize: '0.68rem', bgcolor: SURFACE.muted, color: 'grey.500', borderRadius: '6px' }}
                        />
                      </Box>
                    </Box>
                    <Chip label={status} size="small" variant="outlined"
                      sx={{ ...STATUS_CHIP_STYLES[status], fontWeight: 700, textTransform: 'capitalize', borderRadius: '8px', px: 0.5 }} />
                  </Box>

                  <Typography sx={{ fontSize: 13.5, color: 'grey.600', lineHeight: 1.65, mb: 2.5 }}>
                    {process.description}
                  </Typography>

                  {process.type === 'rnr' ? (
                    <Box
                      onClick={() => setRnrModalId(process.id)}
                      sx={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5,
                        pt: 2, mt: 0.5, borderTop: `1px solid ${B}`, cursor: 'pointer',
                      }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <GroupsRounded sx={{ fontSize: 17, color: BRAND.red }} />
                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'grey.700' }}>
                          {Array.from(new Set((process.rnrNominations || []).map(n => n.department))).length} department(s) in the nomination pipeline
                        </Typography>
                      </Box>
                      <Button size="small" sx={{ textTransform: 'none', fontWeight: 700, fontSize: 12.5, color: BRAND.red, borderRadius: '8px', '&:hover': { bgcolor: BRAND.redBg } }}>
                        View Nomination Track
                      </Button>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', pt: 2, borderTop: `1px solid ${B}` }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, px: 1.8, py: 1.3, borderRadius: '12px', flex: 1, minWidth: 190, border: `1.5px solid ${B}`, bgcolor: SURFACE.rowHeader, transition: 'border-color 0.18s', '&:hover': { borderColor: BRAND.redBorder } }}>
                        <Box sx={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0, bgcolor: BRAND.redLight, color: BRAND.red, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.78rem' }}>
                          {process.assigneeName ? process.assigneeName.slice(0, 2).toUpperCase() : <PersonRounded sx={{ fontSize: 16 }} />}
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography sx={{ fontSize: '0.63rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'grey.400' }}>Assignee</Typography>
                          <Typography sx={{ fontWeight: 600, fontSize: '0.88rem', color: 'grey.800' }} noWrap>{process.assigneeName || 'Unassigned'}</Typography>
                        </Box>
                      </Box>
                      <ReviewerPill label="DM Review" name={process.dmName} status={process.dmStatus} accent="#2563EB"
                        onApprove={() => setApproval(process.id, 'dm', 'approved')}
                        onReject={() => setApproval(process.id, 'dm', 'rejected')} />
                      <ReviewerPill label="TL Review" name={process.tlName} status={process.tlStatus} accent="#7C3AED"
                        onApprove={() => setApproval(process.id, 'tl', 'approved')}
                        onReject={() => setApproval(process.id, 'tl', 'rejected')} />
                    </Box>
                  )}
                </Box>
              </Card>
            );
          })
        )}
      </Box>

      {(() => {
        const rnrModalProcess = processes.find(p => p.id === rnrModalId);
        if (!rnrModalProcess) return null;
        return (
          <Dialog open onClose={() => setRnrModalId(null)} maxWidth="md" fullWidth
            slotProps={{ paper: { sx: { borderRadius: '16px', overflow: 'hidden' } } }}>
            <Box sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              px: 3, py: 2.2, borderBottom: `1px solid ${B}`,
              background: `linear-gradient(135deg, ${BRAND.redBg} 0%, #fff 70%)`,
            }}>
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: 16, color: 'grey.900' }}>{rnrModalProcess.name}</Typography>
                <Typography sx={{ fontSize: 12.5, color: 'grey.500' }}>TL → DM → VP nomination track</Typography>
              </Box>
              <IconButton size="small" onClick={() => setRnrModalId(null)}
                sx={{ transition: 'all 0.18s', '&:hover': { bgcolor: BRAND.redBg, color: BRAND.red, transform: 'rotate(90deg)' } }}>
                <CloseRounded fontSize="small" />
              </IconButton>
            </Box>
            <Box sx={{ p: 3, maxHeight: '75vh', overflowY: 'auto' }}>
              <RnrTrack process={rnrModalProcess}
                onNominate={nominateTeamMember}
                onPick={pickDeptNominee}
                onDeclare={decideDeptWinner} />
            </Box>
          </Dialog>
        );
      })()}
    </Fragment>
  );
};

export default ProcessPage;
