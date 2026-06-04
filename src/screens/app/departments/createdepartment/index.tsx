import { useState, useEffect } from 'react';
import { Box, Typography, Button, InputBase } from '@mui/material';
import { SaveRounded } from '@mui/icons-material';
import { service } from '../../../../service';
import { SnackNotification } from '../../../../helper/snackMessage';
import { BRAND_RED, BRAND_DARK, fieldLabelSx, inputBase, actionRow } from './styles';

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
    <Typography sx={fieldLabelSx}>{children}</Typography>
);

interface Props {
    onSuccess?: () => void;
    editData?: { name: string } | null;
}

const CreateDepartmentForm = ({ onSuccess, editData }: Props) => {
    const [name, setName] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        setName(editData?.name ?? '');
    }, [editData]);

    const handleSave = async () => {
        if (!name.trim()) return SnackNotification('Please enter a department name.', 'error');
        setSubmitting(true);
        try {
            await service.createDepartment({ departlist: [name.trim()] });
            SnackNotification(`Department ${editData ? 'updated' : 'created'} successfully`, 'success');
            setName('');
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
                    <InputBase
                        fullWidth
                        placeholder="e.g. Strategic Growth & Innovation"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        sx={{ fontSize: '13.5px', color: 'grey.800' }}
                    />
                </Box>
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
