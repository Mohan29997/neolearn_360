import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IProcess, ProcessApprovalStatus } from '../../screens/app/process/Process.types';

const d = (daysAgo: number) => new Date(Date.now() - daysAgo * 86400000).toISOString();

const DUMMY: IProcess[] = [
  {
    id: 'p1', type: 'meeting',
    name: 'Weekly Bench Sync',
    category: 'Meeting',
    description: 'Weekly standup for all bench employees to share learning progress, blockers, and upcoming availability. Facilitated by TL, approved by DM.',
    assigneeId: 'u1', assigneeName: 'Aarav Sharma',
    dmId: 'dm1', dmName: 'Ananya Rao',
    tlId: 'tl1', tlName: 'Rohan Verma',
    dmStatus: 'approved', tlStatus: 'approved', createdAt: d(7),
  },
  {
    id: 'p2', type: 'client_visit',
    name: 'TechCorp On-site Showcase',
    category: 'Client Visit',
    description: 'On-site visit to TechCorp HQ for a capability showcase. Bench engineers will present their POC projects. Requires DM and TL approval before confirmation.',
    assigneeId: 'u3', assigneeName: 'Vikram Joshi',
    dmId: 'dm2', dmName: 'Sana Khan',
    tlId: 'tl1', tlName: 'Rohan Verma',
    dmStatus: 'approved', tlStatus: 'pending', createdAt: d(4),
  },
  {
    id: 'p3', type: 'feedback',
    name: 'Q2 Bench Performance Feedback',
    category: 'Feedback',
    description: '360° feedback collection for all bench employees covering learning pace, course completion, and readiness for project allocation. Reviewed by DM and TL.',
    assigneeId: 'u5', assigneeName: 'Arjun Singh',
    dmId: 'dm2', dmName: 'Sana Khan',
    tlId: 'tl1', tlName: 'Rohan Verma',
    dmStatus: 'pending', tlStatus: 'pending', createdAt: d(2),
  },
  {
    id: 'p4', type: 'rnr',
    name: 'Star Performer — June 2026',
    category: 'RnR',
    description: 'Every TL nominates one team member, each DM advances one nominee per department, and the department VP declares the final Rewards & Recognition winner.',
    assigneeId: '', assigneeName: '',
    dmId: '', dmName: '',
    tlId: '', tlName: '',
    dmStatus: 'pending', tlStatus: 'pending', createdAt: d(5),
    rnrNominations: [
      {
        tlId: 'tl1', tlName: 'Rohan Verma', department: 'Engineering',
        teamMemberOptions: [{ id: 'u1', name: 'Aarav Sharma' }, { id: 'u6', name: 'Priya Patel' }],
        nomineeId: 'u1', nomineeName: 'Aarav Sharma',
        note: 'Completed 4 courses in 3 weeks and built a full-stack POC independently.',
        status: 'submitted', submittedAt: d(4),
      },
      {
        tlId: 'tl2', tlName: 'Kabir Malhotra', department: 'Engineering',
        teamMemberOptions: [{ id: 'u2', name: 'Devika Nair' }, { id: 'u3', name: 'Vikram Joshi' }],
        nomineeId: '', nomineeName: '', note: '', status: 'pending',
      },
    ],
    rnrDmPicks: [
      { department: 'Engineering', dmId: 'dm2', dmName: 'Sana Khan', nomineeId: '', nomineeName: '', status: 'pending' },
    ],
    rnrWinners: [
      { department: 'Engineering', vpName: 'Meera Iyer', winnerId: '', winnerName: '', status: 'pending' },
    ],
  },
  {
    id: 'p5', type: 'custom',
    name: 'Internal Hackathon — July 2026',
    category: 'Operations',
    description: '2-day internal hackathon for bench employees to build innovative solutions using their current learning stack. Teams of 3, judged by DM and TL panel.',
    assigneeId: 'u2', assigneeName: 'Devika Nair',
    dmId: 'dm1', dmName: 'Ananya Rao',
    tlId: 'tl2', tlName: 'Kabir Malhotra',
    dmStatus: 'approved', tlStatus: 'pending', createdAt: d(1),
  },
];

interface ProcessState { processes: IProcess[] }
const initialState: ProcessState = { processes: DUMMY };

export const ProcessSlice = createSlice({
  name: 'process',
  initialState,
  reducers: {
    addProcess(state, action: PayloadAction<IProcess>) {
      state.processes.unshift(action.payload);
    },
    setApprovalStatus(state, action: PayloadAction<{ id: string; reviewer: 'dm' | 'tl'; status: ProcessApprovalStatus }>) {
      const p = state.processes.find(x => x.id === action.payload.id);
      if (!p) return;
      if (action.payload.reviewer === 'dm') p.dmStatus = action.payload.status;
      else p.tlStatus = action.payload.status;
    },
    setComment(state, action: PayloadAction<{ id: string; reviewer: 'dm' | 'tl'; comment: string }>) {
      const p = state.processes.find(x => x.id === action.payload.id);
      if (!p) return;
      if (action.payload.reviewer === 'dm') p.dmComment = action.payload.comment;
      else p.tlComment = action.payload.comment;
    },
    // RnR stage 1: a TL nominates one member from their own team
    submitTlNomination(state, action: PayloadAction<{ id: string; tlId: string; nomineeId: string; nomineeName: string; note: string }>) {
      const p = state.processes.find(x => x.id === action.payload.id);
      const nom = p?.rnrNominations?.find(n => n.tlId === action.payload.tlId);
      if (!nom) return;
      nom.nomineeId = action.payload.nomineeId;
      nom.nomineeName = action.payload.nomineeName;
      nom.note = action.payload.note;
      nom.status = 'submitted';
      nom.submittedAt = new Date().toISOString();
    },
    // RnR stage 2: DM advances one nominee for their department
    submitDmPick(state, action: PayloadAction<{ id: string; department: string; nomineeId: string; nomineeName: string }>) {
      const p = state.processes.find(x => x.id === action.payload.id);
      const pick = p?.rnrDmPicks?.find(x => x.department === action.payload.department);
      if (!pick) return;
      pick.nomineeId = action.payload.nomineeId;
      pick.nomineeName = action.payload.nomineeName;
      pick.status = 'picked';
      pick.pickedAt = new Date().toISOString();
    },
    // RnR stage 3: VP declares the department's final winner
    declareRnrWinner(state, action: PayloadAction<{ id: string; department: string }>) {
      const p = state.processes.find(x => x.id === action.payload.id);
      const pick = p?.rnrDmPicks?.find(x => x.department === action.payload.department);
      const winner = p?.rnrWinners?.find(x => x.department === action.payload.department);
      if (!pick || !winner || pick.status !== 'picked') return;
      winner.winnerId = pick.nomineeId;
      winner.winnerName = pick.nomineeName;
      winner.status = 'decided';
      winner.decidedAt = new Date().toISOString();
    },
  },
});

export const {
  addProcess, setApprovalStatus, setComment,
  submitTlNomination, submitDmPick, declareRnrWinner,
} = ProcessSlice.actions;
export default ProcessSlice.reducer;
