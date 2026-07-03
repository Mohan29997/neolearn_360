import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../../store';
import {
  addProcess, setApprovalStatus, setComment,
  submitTlNomination, submitDmPick, declareRnrWinner,
} from '../../../store/reducer/ProcessSlice';
import { service } from '../../../service';
import { SnackNotification } from '../../../helper/snackMessage';
import type { IUser } from '../../../types/auth.types';
import type {
  IProcess, IRnrTlNomination, IRnrDmPick, IRnrWinner,
  ProcessApprovalStatus, ProcessType,
} from '../../../screens/app/process/Process.types';

const TYPE_DEFAULTS: Record<ProcessType, { name: string; category: string; description: string }> = {
  meeting: {
    name: 'Meeting Process',
    category: 'Meeting',
    description: 'Schedule and coordinate a team or stakeholder meeting. Requires DM and TL approval before confirmation.',
  },
  client_visit: {
    name: 'Client Visit Process',
    category: 'Client Visit',
    description: 'Plan and execute a client on-site or virtual visit. Includes logistics, agenda preparation, and capability showcase. Requires DM and TL sign-off.',
  },
  feedback: {
    name: 'Feedback Process',
    category: 'Feedback',
    description: 'Collect structured feedback from bench employees or stakeholders. Results reviewed and actioned by DM and TL.',
  },
  rnr: {
    name: 'Rewards & Recognition',
    category: 'RnR',
    description: 'Nominate a bench employee for a reward based on outstanding learning velocity, POC quality, or team contribution. Routed to DM and TL for approval.',
  },
  custom: { name: '', category: '', description: '' },
};

function extractUsers(res: unknown): IUser[] {
  const r = res as Record<string, unknown> | undefined;
  const data = r?.data as Record<string, unknown> | undefined;
  if (Array.isArray(data?.users)) return data!.users as IUser[];
  if (Array.isArray(data)) return data as IUser[];
  return [];
}

export const useProcess = () => {
  const dispatch = useDispatch();
  const processes = useSelector((s: RootState) => s.process.processes);

  const [assignees, setAssignees] = useState<IUser[]>([]);
  const [dmUsers, setDmUsers] = useState<IUser[]>([]);
  const [tlUsers, setTlUsers] = useState<IUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [processType, setProcessType] = useState<ProcessType | ''>('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [dmId, setDmId] = useState('');
  const [tlId, setTlId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchFormData = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const [uRes, dmRes, tlRes] = await Promise.all([
        service.getUsers({ page: 1, limit: 90 }),
        service.getUsers({ page: 1, limit: 90, role: 'DM' }),
        service.getUsers({ page: 1, limit: 90, role: 'TL' }),
      ]);
      setAssignees(extractUsers(uRes));
      setDmUsers(extractUsers(dmRes));
      setTlUsers(extractUsers(tlRes));
    } catch {
      // best effort
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => { fetchFormData(); }, [fetchFormData]);

  const handleTypeSelect = (type: ProcessType) => {
    setProcessType(type);
    const defaults = TYPE_DEFAULTS[type];
    setName(defaults.name);
    setCategory(defaults.category);
    setDescription(defaults.description);
  };

  const resetForm = () => {
    setProcessType('');
    setName(''); setCategory(''); setDescription('');
    setAssigneeId(''); setDmId(''); setTlId('');
  };

  const isTypeSelected = processType !== '';
  const isRnr = processType === 'rnr';
  const isValid = Boolean(
    isTypeSelected && name.trim() && category && description.trim()
    && (isRnr ? tlUsers.length > 0 : assigneeId && dmId && tlId),
  );

  // Build the TL -> DM -> VP pipeline: every TL nominates from their own team,
  // one DM pick and one VP winner per department that has a TL.
  const buildRnrPipeline = () => {
    const rnrNominations: IRnrTlNomination[] = tlUsers.map(tl => {
      const department = tl.department || 'General';
      const teamMemberOptions = assignees
        .filter(u => u.tlName === tl.name)
        .map(u => ({ id: u._id, name: u.name }));
      return {
        tlId: tl._id, tlName: tl.name, department, teamMemberOptions,
        nomineeId: '', nomineeName: '', note: '', status: 'pending',
      };
    });

    const departments = Array.from(new Set(rnrNominations.map(n => n.department)));

    const rnrDmPicks: IRnrDmPick[] = departments.map(department => {
      const dm = dmUsers.find(u => u.department === department);
      return {
        department, dmId: dm?._id || '', dmName: dm?.name || 'Unassigned DM',
        nomineeId: '', nomineeName: '', status: 'pending',
      };
    });

    const rnrWinners: IRnrWinner[] = departments.map(department => {
      const vpName = assignees.find(u => u.department === department && u.vpName)?.vpName
        || dmUsers.find(u => u.department === department)?.vpName
        || 'Unassigned VP';
      return { department, vpName, winnerId: '', winnerName: '', status: 'pending' };
    });

    return { rnrNominations, rnrDmPicks, rnrWinners };
  };

  const handleCreateProcess = () => {
    if (!isValid || !processType) return;
    setIsSubmitting(true);

    const assignee = assignees.find(u => u._id === assigneeId);
    const dm = dmUsers.find(u => u._id === dmId);
    const tl = tlUsers.find(u => u._id === tlId);

    const newProcess: IProcess = {
      id: `${Date.now()}`,
      type: processType,
      name: name.trim(),
      category,
      description: description.trim(),
      assigneeId: isRnr ? '' : assigneeId,
      assigneeName: isRnr ? '' : (assignee?.name || ''),
      dmId: isRnr ? '' : dmId,
      dmName: isRnr ? '' : (dm?.name || ''),
      tlId: isRnr ? '' : tlId,
      tlName: isRnr ? '' : (tl?.name || ''),
      dmStatus: 'pending',
      tlStatus: 'pending',
      createdAt: new Date().toISOString(),
      ...(isRnr ? buildRnrPipeline() : {}),
    };

    dispatch(addProcess(newProcess));
    SnackNotification(
      isRnr ? 'RnR process created — all TLs can now nominate a team member' : 'Process created and sent for DM & TL review',
      'success',
    );
    resetForm();
    setFormOpen(false);
    setIsSubmitting(false);
  };

  const setApproval = (processId: string, reviewer: 'dm' | 'tl', status: ProcessApprovalStatus) => {
    dispatch(setApprovalStatus({ id: processId, reviewer, status }));
  };

  const saveComment = (processId: string, reviewer: 'dm' | 'tl', comment: string) => {
    dispatch(setComment({ id: processId, reviewer, comment }));
  };

  const nominateTeamMember = (processId: string, tlId: string, nomineeId: string, nomineeName: string, note: string) => {
    dispatch(submitTlNomination({ id: processId, tlId, nomineeId, nomineeName, note }));
  };

  const pickDeptNominee = (processId: string, department: string, nomineeId: string, nomineeName: string) => {
    dispatch(submitDmPick({ id: processId, department, nomineeId, nomineeName }));
  };

  const decideDeptWinner = (processId: string, department: string) => {
    dispatch(declareRnrWinner({ id: processId, department }));
  };

  return {
    processes, assignees, dmUsers, tlUsers, loadingUsers,
    formOpen, setFormOpen,
    processType, handleTypeSelect,
    name, setName, category, setCategory, description, setDescription,
    assigneeId, setAssigneeId, dmId, setDmId, tlId, setTlId,
    isSubmitting, isValid, isTypeSelected, isRnr,
    handleCreateProcess, resetForm, setApproval, saveComment,
    nominateTeamMember, pickDeptNominee, decideDeptWinner,
  };
};
