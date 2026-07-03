import { useState } from 'react';
import {
  Box, Button, Chip, FormControl, MenuItem, Select, Typography, InputBase,
} from '@mui/material';
import {
  CheckCircleRounded, EmojiEventsRounded, GroupsRounded,
  PersonRounded, SupervisorAccountRounded,
} from '@mui/icons-material';
import { BRAND, SURFACE } from '../../../constants/brand.constants';
import type { IProcess } from './Process.types';

const B = SURFACE.border;

const StageLabel = ({ icon, children }: { icon: React.ReactNode; children: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7, mb: 1 }}>
    {icon}
    <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'grey.500', textTransform: 'uppercase', letterSpacing: 0.5 }}>
      {children}
    </Typography>
  </Box>
);

const TlNominationRow = ({
  processId, tlId, tlName, teamMemberOptions, nomineeName, status,
  onSubmit,
}: {
  processId: string; tlId: string; tlName: string;
  teamMemberOptions: { id: string; name: string }[]; nomineeName: string;
  status: 'pending' | 'submitted';
  onSubmit: (processId: string, tlId: string, nomineeId: string, nomineeName: string, note: string) => void;
}) => {
  const [selected, setSelected] = useState('');
  const [note, setNote] = useState('');

  if (status === 'submitted') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 1, borderRadius: '8px', bgcolor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
        <CheckCircleRounded sx={{ fontSize: 16, color: '#16A34A' }} />
        <Typography sx={{ fontSize: 12.5, color: 'grey.700' }}>
          <strong>{tlName}</strong> nominated <strong>{nomineeName}</strong>
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', px: 1.5, py: 1, borderRadius: '8px', border: `1px solid ${B}`, bgcolor: '#fff' }}>
      <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: 'grey.700', minWidth: 110 }}>{tlName}</Typography>
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <Select displayEmpty value={selected} onChange={e => setSelected(e.target.value)} sx={{ fontSize: 12.5 }}>
          <MenuItem value="" disabled>Select team member</MenuItem>
          {teamMemberOptions.length === 0
            ? <MenuItem value="" disabled>No team members found</MenuItem>
            : teamMemberOptions.map(m => <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>)}
        </Select>
      </FormControl>
      <InputBase placeholder="Note (optional)" value={note} onChange={e => setNote(e.target.value)}
        sx={{ fontSize: 12.5, flex: 1, minWidth: 140, border: `1px solid ${B}`, borderRadius: '6px', px: 1, py: 0.4 }} />
      <Button size="small" variant="contained" disabled={!selected}
        onClick={() => {
          const member = teamMemberOptions.find(m => m.id === selected);
          if (!member) return;
          onSubmit(processId, tlId, member.id, member.name, note);
        }}
        sx={{ textTransform: 'none', fontWeight: 700, fontSize: 11.5, borderRadius: '6px', bgcolor: BRAND.red, boxShadow: 'none', '&:hover': { bgcolor: BRAND.redHover } }}>
        Nominate
      </Button>
    </Box>
  );
};

const RnrTrack = ({
  process, onNominate, onPick, onDeclare,
}: {
  process: IProcess;
  onNominate: (processId: string, tlId: string, nomineeId: string, nomineeName: string, note: string) => void;
  onPick: (processId: string, department: string, nomineeId: string, nomineeName: string) => void;
  onDeclare: (processId: string, department: string) => void;
}) => {
  const [dmSelections, setDmSelections] = useState<Record<string, string>>({});
  const nominations = process.rnrNominations || [];
  const dmPicks = process.rnrDmPicks || [];
  const winners = process.rnrWinners || [];

  const departments = Array.from(new Set(nominations.map(n => n.department)));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {departments.map(department => {
        const deptNominations = nominations.filter(n => n.department === department);
        const allSubmitted = deptNominations.length > 0 && deptNominations.every(n => n.status === 'submitted');
        const dmPick = dmPicks.find(p => p.department === department);
        const winner = winners.find(w => w.department === department);
        const submittedNominees = deptNominations.filter(n => n.status === 'submitted');

        return (
          <Box key={department} sx={{ border: `1.5px solid ${B}`, borderRadius: '12px', overflow: 'hidden' }}>
            <Box sx={{ px: 2, py: 1.2, bgcolor: SURFACE.rowHeader, borderBottom: `1px solid ${B}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ fontWeight: 700, fontSize: 13.5, color: 'grey.900' }}>{department}</Typography>
              {winner?.status === 'decided' ? (
                <Chip icon={<EmojiEventsRounded sx={{ fontSize: 15 }} />} label={`Winner: ${winner.winnerName}`} size="small"
                  sx={{ fontWeight: 700, bgcolor: '#FFFBEB', color: '#D97706', border: '1px solid #FDE68A' }} />
              ) : (
                <Chip label={allSubmitted ? (dmPick?.status === 'picked' ? 'Awaiting VP' : 'Awaiting DM') : 'Awaiting TLs'} size="small"
                  sx={{ fontWeight: 700, fontSize: 11, bgcolor: SURFACE.muted, color: 'grey.600' }} />
              )}
            </Box>

            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <StageLabel icon={<GroupsRounded sx={{ fontSize: 15, color: BRAND.red }} />}>TL Nominations</StageLabel>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {deptNominations.map(n => (
                    <TlNominationRow key={n.tlId} processId={process.id} tlId={n.tlId} tlName={n.tlName}
                      teamMemberOptions={n.teamMemberOptions} nomineeName={n.nomineeName} status={n.status}
                      onSubmit={onNominate} />
                  ))}
                </Box>
              </Box>

              <Box sx={{ opacity: allSubmitted ? 1 : 0.5, pointerEvents: allSubmitted ? 'auto' : 'none' }}>
                <StageLabel icon={<SupervisorAccountRounded sx={{ fontSize: 15, color: '#2563EB' }} />}>DM Selection — {dmPick?.dmName}</StageLabel>
                {dmPick?.status === 'picked' ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 1, borderRadius: '8px', bgcolor: '#EFF6FF', border: '1px solid #BFDBFE' }}>
                    <CheckCircleRounded sx={{ fontSize: 16, color: '#2563EB' }} />
                    <Typography sx={{ fontSize: 12.5, color: 'grey.700' }}>Advanced <strong>{dmPick.nomineeName}</strong> to VP</Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <FormControl size="small" sx={{ minWidth: 180 }}>
                      <Select displayEmpty value={dmSelections[department] || ''}
                        onChange={e => setDmSelections(prev => ({ ...prev, [department]: e.target.value }))}
                        sx={{ fontSize: 12.5 }}>
                        <MenuItem value="" disabled>Select nominee to advance</MenuItem>
                        {submittedNominees.map(n => <MenuItem key={n.nomineeId} value={n.nomineeId}>{n.nomineeName} ({n.tlName})</MenuItem>)}
                      </Select>
                    </FormControl>
                    <Button size="small" variant="contained" disabled={!dmSelections[department]}
                      onClick={() => {
                        const nominee = submittedNominees.find(n => n.nomineeId === dmSelections[department]);
                        if (!nominee) return;
                        onPick(process.id, department, nominee.nomineeId, nominee.nomineeName);
                      }}
                      sx={{ textTransform: 'none', fontWeight: 700, fontSize: 11.5, borderRadius: '6px', bgcolor: '#2563EB', boxShadow: 'none', '&:hover': { bgcolor: '#1D4ED8' } }}>
                      Advance
                    </Button>
                  </Box>
                )}
              </Box>

              <Box sx={{ opacity: dmPick?.status === 'picked' ? 1 : 0.5, pointerEvents: dmPick?.status === 'picked' ? 'auto' : 'none' }}>
                <StageLabel icon={<PersonRounded sx={{ fontSize: 15, color: '#D97706' }} />}>VP Decision — {winner?.vpName}</StageLabel>
                {winner?.status === 'decided' ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 1, borderRadius: '8px', bgcolor: '#FFFBEB', border: '1px solid #FDE68A' }}>
                    <EmojiEventsRounded sx={{ fontSize: 16, color: '#D97706' }} />
                    <Typography sx={{ fontSize: 12.5, color: 'grey.700' }}><strong>{winner.winnerName}</strong> declared department RnR winner</Typography>
                  </Box>
                ) : (
                  <Button size="small" variant="contained" disabled={dmPick?.status !== 'picked'}
                    onClick={() => onDeclare(process.id, department)}
                    startIcon={<EmojiEventsRounded sx={{ fontSize: 15 }} />}
                    sx={{ textTransform: 'none', fontWeight: 700, fontSize: 11.5, borderRadius: '6px', bgcolor: '#D97706', boxShadow: 'none', '&:hover': { bgcolor: '#B45309' } }}>
                    Declare {dmPick?.nomineeName || 'nominee'} as Winner
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default RnrTrack;
