export type ProcessApprovalStatus = 'pending' | 'approved' | 'rejected';
export type ProcessType = 'meeting' | 'client_visit' | 'feedback' | 'rnr' | 'custom';

// RnR stage 1: each TL nominates one member from their own team
export interface IRnrTlNomination {
  tlId: string;
  tlName: string;
  department: string;
  teamMemberOptions: { id: string; name: string }[];
  nomineeId: string;
  nomineeName: string;
  note: string;
  status: 'pending' | 'submitted';
  submittedAt?: string;
}

// RnR stage 2: DM advances one nominee per department (from that department's TL nominations)
export interface IRnrDmPick {
  department: string;
  dmId: string;
  dmName: string;
  nomineeId: string;
  nomineeName: string;
  status: 'pending' | 'picked';
  pickedAt?: string;
}

// RnR stage 3: VP declares the department's final RnR winner
export interface IRnrWinner {
  department: string;
  vpName: string;
  winnerId: string;
  winnerName: string;
  status: 'pending' | 'decided';
  decidedAt?: string;
}

export interface IProcess {
  id: string;
  type: ProcessType;
  name: string;
  category: string;
  description: string;
  assigneeId: string;
  assigneeName: string;
  dmId: string;
  dmName: string;
  tlId: string;
  tlName: string;
  dmStatus: ProcessApprovalStatus;
  tlStatus: ProcessApprovalStatus;
  createdAt: string;
  // nomination / suggestion comments per reviewer
  tlComment?: string;
  dmComment?: string;
  // for RnR: nominee details (legacy single-nominee fields, kept for older records)
  nomineeId?: string;
  nomineeName?: string;
  nomineeRole?: string;
  nomineeAchievement?: string;
  // RnR: TL -> DM -> VP nomination pipeline, one track per department
  rnrNominations?: IRnrTlNomination[];
  rnrDmPicks?: IRnrDmPick[];
  rnrWinners?: IRnrWinner[];
}
