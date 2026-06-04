import { useState, useEffect } from 'react';
import { Box, Typography, Button, InputBase, Select, MenuItem, FormControl } from '@mui/material';
import { SaveRounded } from '@mui/icons-material';
import { service } from '../../../../service';
import { SnackNotification } from '../../../../helper/snackMessage';
import { BRAND_RED, BRAND_DARK, fieldLabelSx, inputBase, actionRow, selectBase } from './styles';

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
    <Typography sx={fieldLabelSx}>{children}</Typography>
);

interface Manager { _id: string; fullName: string; name?: string; employeeId?: string; employee_id?: string; }

interface EditData {
    _id: string;
    name: string;
    managerName?: string;
    employeeId?: string;
    isActive?: boolean;
}

interface Props {
    onSuccess?: () => void;
    editData?: EditData | null;
}

const CreateDepartmentForm = ({ onSuccess, editData }: Props) => {
    const isEdit = !!editData?._id;
    const [name, setName] = useState(editData?.name ?? '');
    const [selectedManager, setSelectedManager] = useState<Manager | null>(null);
    const [managers, setManagers] = useState<Manager[]>([]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        service.getManagerUsers().then((res: any) => {
            const allUsers: Record<string, string>[] = res?.data?.users ?? res?.users ?? (Array.isArray(res?.data) ? res.data : []);
            const arr: Manager[] = allUsers
                .filter((u) => String(u.role).toUpperCase() === 'MANAGER')
                .map((u) => ({
                    _id: u._id,
                    fullName: u.fullName || u.name || '',
                    employeeId: u.employeeId || '',
                }));
            setManagers(arr);
            if (editData?.managerName) {
                const match = arr.find(m =>
                    m.fullName.toLowerCase() === editData.managerName!.toLowerCase()
                );
                if (match) setSelectedManager(match);
            }
        }).catch(() => {});
    }, [editData?.managerName]);

    const handleSave = async () => {
        if (!name.trim()) return SnackNotification('Please enter a department name.', 'error');
        setSubmitting(true);
        try {
            const managerName = selectedManager ? (selectedManager.fullName || selectedManager.name || '') : '';
            const employeeId  = selectedManager ? (selectedManager.employeeId || selectedManager.employee_id || '') : '';

            if (isEdit) {
                await service.updateDepartment(editData!._id, {
                    name: name.trim(),
                    manager_name: managerName,
                    employee_id: employeeId,
                    isActive: editData!.isActive ?? true,
                });
            } else {
                await service.createDepartment({
                    departlist: [{ name: name.trim(), manager_name: managerName, employee_id: employeeId }]
                });
            }
            SnackNotification(`Department ${isEdit ? 'updated' : 'created'} successfully`, 'success');
            setName('');
            setSelectedManager(null);
            onSuccess?.();
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 2.5 }}>
                <FieldLabel>Department Name *</FieldLabel>
                <Box sx={inputBase}>
                    <InputBase fullWidth placeholder="e.g. Strategic Growth & Innovation" value={name} onChange={e => setName(e.target.value)} sx={{ fontSize: '13.5px', color: 'grey.800' }} />
                </Box>
            </Box>

            <Box sx={{ mb: 2.5 }}>
                <FieldLabel>Manager Name</FieldLabel>
                <FormControl fullWidth size="small">
                    <Select
                        size="small"
                        displayEmpty
                        value={selectedManager?._id ?? ''}
                        onChange={e => setSelectedManager(managers.find(m => m._id === e.target.value) ?? null)}
                        sx={selectBase}
                        renderValue={v => (v ? (selectedManager?.fullName || selectedManager?.name || '') : <Typography sx={{ color: 'grey.400', fontSize: '13.5px' }}>Select manager</Typography>)}
                    >
                        {managers.map(m => {
                            const label = m.fullName || m.name || '';
                            return <MenuItem key={m._id} value={m._id}>{label}</MenuItem>;
                        })}
                    </Select>
                </FormControl>
            </Box>

            <Box sx={actionRow}>
                <Button
                    variant="text"
                    onClick={() => onSuccess?.()}
                    sx={{ color: 'grey.600', fontWeight: 600, fontSize: '13px', textTransform: 'none', px: 2 }}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    startIcon={<SaveRounded />}
                    disabled={submitting}
                    onClick={handleSave}
                    sx={{
                        background: BRAND_DARK,
                        fontWeight: 600,
                        fontSize: '13px',
                        borderRadius: '8px',
                        textTransform: 'none',
                        px: 3,
                        boxShadow: '0 4px 14px rgba(138,3,3,0.25)',
                        '&:hover': { background: BRAND_RED },
                    }}
                >
                    {submitting ? 'Saving...' : 'Save Department'}
                </Button>
            </Box>
        </Box>
    );
};

export default CreateDepartmentForm;
