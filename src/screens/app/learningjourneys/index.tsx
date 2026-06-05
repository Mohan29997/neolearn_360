import { Fragment, useEffect, useState } from 'react';
import {
    Box, Typography, Chip, LinearProgress,
    Dialog, DialogTitle, DialogContent, IconButton,
    Divider, List, ListItem, ListItemText, Tooltip, CircularProgress,
} from '@mui/material';
import {
    ChevronRightRounded, CloseRounded, OpenInNewRounded,
    CheckCircleRounded, RadioButtonUncheckedRounded, AddCircleRounded, RemoveCircleRounded,
} from '@mui/icons-material';
import TabTitle from '../../../components/tabtitle';
import { service } from '../../../service';

const BRAND_RED = '#8B1A2E';

const LEVEL_COLORS: Record<string, { color: string; bg: string }> = {
    Beginner:     { color: '#16A34A', bg: '#F0FDF4' },
    Intermediate: { color: '#D97706', bg: '#FFFBEB' },
    Advanced:     { color: '#2563EB', bg: '#EFF6FF' },
};

// -- Course Detail Modal --

const CourseDetailModal = ({ journey, open, onClose }: { journey: any | null; open: boolean; onClose: () => void }) => {
    if (!journey) return null;
    const lc = LEVEL_COLORS[journey.level] ?? LEVEL_COLORS.Intermediate;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '16px', maxHeight: '88vh' } }}>
            <DialogTitle sx={{ p: 0 }}>
                <Box sx={{ px: 3, pt: 3, pb: 2, borderBottom: '1px solid', borderColor: 'grey.100' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                            <Chip label={journey.track} size="small"
                                sx={{ fontSize: 11, fontWeight: 700, bgcolor: '#FFF1F2', color: BRAND_RED, borderRadius: '6px', letterSpacing: '0.4px', mb: 1 }} />
                            <Typography variant="h5" fontWeight={800} sx={{ color: 'grey.900', lineHeight: 1.3 }}>{journey.title}</Typography>
                            <Typography sx={{ fontSize: 13.5, color: 'grey.600', mt: 0.8, lineHeight: 1.7 }}>{journey.description}</Typography>
                            <Box sx={{ display: 'flex', gap: 1.5, mt: 1.5, flexWrap: 'wrap' }}>
                                <Chip label={`${journey.courses} Courses`} size="small" sx={{ fontSize: 12, bgcolor: '#F3F4F6', color: 'grey.700', borderRadius: '6px' }} />
                                <Chip label={journey.duration} size="small" sx={{ fontSize: 12, bgcolor: '#F3F4F6', color: 'grey.700', borderRadius: '6px' }} />
                                <Chip label={journey.level} size="small" sx={{ fontSize: 12, fontWeight: 600, bgcolor: lc.bg, color: lc.color, borderRadius: '6px' }} />
                            </Box>
                        </Box>
                        <IconButton onClick={onClose} size="small" sx={{ mt: 0.5, color: 'grey.500' }}><CloseRounded /></IconButton>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'grey.500' }}>OVERALL PROGRESS</Typography>
                            <Typography sx={{ fontSize: 12, fontWeight: 700, color: BRAND_RED }}>{journey.progress}%</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={journey.progress}
                            sx={{ height: 6, borderRadius: 3, bgcolor: '#F3F4F6', '& .MuiLinearProgress-bar': { bgcolor: BRAND_RED, borderRadius: 3 } }} />
                        <Typography sx={{ fontSize: 12, color: 'grey.400', mt: 0.5 }}>
                            {journey.completedCourses} of {journey.courses} courses completed
                        </Typography>
                    </Box>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ p: 0 }}>
                <Box sx={{ px: 3, pt: 2, pb: 1 }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ color: 'grey.800' }}>Courses in this Journey</Typography>
                </Box>
                <List disablePadding>
                    {(journey.courseList ?? []).map((course: any, idx: number) => (
                        <Fragment key={course.id ?? idx}>
                            {idx > 0 && <Divider sx={{ mx: 3 }} />}
                            <ListItem alignItems="flex-start" sx={{ px: 3, py: 2, '&:hover': { bgcolor: 'grey.50' }, transition: 'background 0.15s' }}>
                                <Box sx={{ mr: 1.5, mt: 0.3, flexShrink: 0 }}>
                                    {course.completed
                                        ? <CheckCircleRounded sx={{ color: '#16A34A', fontSize: 20 }} />
                                        : <RadioButtonUncheckedRounded sx={{ color: 'grey.300', fontSize: 20 }} />}
                                </Box>
                                <ListItemText disableTypography primary={
                                    <Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                            <Typography fontWeight={700} sx={{ fontSize: 14.5, color: 'grey.900' }}>{course.title}</Typography>
                                            {course.completed && (
                                                <Chip label="Completed" size="small"
                                                    sx={{ fontSize: 11, fontWeight: 600, bgcolor: '#F0FDF4', color: '#16A34A', borderRadius: '6px', height: 20 }} />
                                            )}
                                        </Box>
                                        <Typography sx={{ fontSize: 13, color: 'grey.500', mt: 0.4, lineHeight: 1.6 }}>{course.description}</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
                                            <Chip label={course.duration} size="small"
                                                sx={{ fontSize: 11, bgcolor: '#F3F4F6', color: 'grey.600', borderRadius: '6px', height: 22 }} />
                                            {course.link && (
                                                <Typography component="a" href={course.link} target="_blank" rel="noopener noreferrer"
                                                    sx={{ fontSize: 12.5, color: BRAND_RED, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 0.3, '&:hover': { textDecoration: 'underline' } }}>
                                                    Open Course <OpenInNewRounded sx={{ fontSize: 13 }} />
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                } />
                            </ListItem>
                        </Fragment>
                    ))}
                </List>
            </DialogContent>
        </Dialog>
    );
};

// -- Journey Card --

const JourneyCard = ({ journey, onClick, onProgressChange }: { journey: any; onClick: () => void; onProgressChange: (delta: number) => void }) => {
    const lc = LEVEL_COLORS[journey.level] ?? LEVEL_COLORS.Intermediate;
    return (
        <Box onClick={onClick} sx={{ bgcolor: '#fff', border: '1px solid', borderColor: 'grey.200', borderRadius: '14px', p: 3, mb: 2, cursor: 'pointer', transition: 'box-shadow 0.2s, border-color 0.2s', '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.09)', borderColor: BRAND_RED } }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 3 }}>
                <Box sx={{ flex: 1 }}>
                    <Chip label={journey.track} size="small"
                        sx={{ fontSize: 11, fontWeight: 700, bgcolor: '#FFF1F2', color: BRAND_RED, borderRadius: '6px', letterSpacing: '0.4px', mb: 1.5 }} />
                    <Typography variant="h5" fontWeight={800} sx={{ color: 'grey.900', mb: 1 }}>{journey.title}</Typography>
                    <Typography sx={{ fontSize: 13.5, color: 'grey.600', lineHeight: 1.7, maxWidth: 560 }}>{journey.description}</Typography>
                    <Box sx={{ display: 'flex', gap: 1.5, mt: 2, flexWrap: 'wrap' }}>
                        <Chip label={`${journey.courses} Courses`} size="small" sx={{ fontSize: 12, bgcolor: '#F3F4F6', color: 'grey.700', borderRadius: '6px' }} />
                        <Chip label={journey.duration} size="small" sx={{ fontSize: 12, bgcolor: '#F3F4F6', color: 'grey.700', borderRadius: '6px' }} />
                        <Chip label={journey.level} size="small" sx={{ fontSize: 12, fontWeight: 600, bgcolor: lc.bg, color: lc.color, borderRadius: '6px' }} />
                    </Box>
                </Box>
                <Box sx={{ minWidth: 180, textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                    <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'grey.500', letterSpacing: '0.5px', mb: 0.5 }}>CURRENT PROGRAM PROGRESS</Typography>
                    <Typography sx={{ fontSize: 48, fontWeight: 900, color: BRAND_RED, lineHeight: 1 }}>{journey.progress}%</Typography>
                    <LinearProgress variant="determinate" value={journey.progress}
                        sx={{ mt: 1.5, height: 6, borderRadius: 3, bgcolor: '#F3F4F6', '& .MuiLinearProgress-bar': { bgcolor: BRAND_RED, borderRadius: 3 } }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5, mt: 0.8 }}>
                        <Tooltip title="Remove one course">
                            <span>
                                <IconButton size="small" disabled={journey.completedCourses === 0} onClick={() => onProgressChange(-1)}
                                    sx={{ p: 0.3, color: journey.completedCourses === 0 ? 'grey.300' : 'grey.500', '&:hover': { color: BRAND_RED } }}>
                                    <RemoveCircleRounded sx={{ fontSize: 18 }} />
                                </IconButton>
                            </span>
                        </Tooltip>
                        <Typography sx={{ fontSize: 12, color: 'grey.500' }}>{journey.completedCourses} of {journey.courses} courses</Typography>
                        <Tooltip title="Complete one more course">
                            <span>
                                <IconButton size="small" disabled={journey.completedCourses === journey.courses} onClick={() => onProgressChange(1)}
                                    sx={{ p: 0.3, color: journey.completedCourses === journey.courses ? 'grey.300' : BRAND_RED, '&:hover': { color: '#6e1424' } }}>
                                    <AddCircleRounded sx={{ fontSize: 18 }} />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

// -- Page --

const LearningJourneys = () => {
    const [journeys, setJourneys] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedJourney, setSelectedJourney] = useState<any | null>(null);

    useEffect(() => {
        const fetchJourneys = async () => {
            try {
                setIsLoading(true);
                const res = await service.getLearningJourneys({ page: 1, limit: 20 });
                const data = res?.data;
                const list: any[] = data?.learningJourneys ?? data?.journeys ?? data?.data ?? (Array.isArray(data) ? data : []);
                setJourneys(list.map((j: any) => ({
                    _id: j._id,
                    track: j.track ?? j.category ?? 'TRACK',
                    title: j.title ?? j.name ?? '',
                    description: j.description ?? '',
                    progress: j.progress ?? 0,
                    courses: j.total_courses ?? (Array.isArray(j.courses) ? j.courses.length : j.courses) ?? 0,
                    completedCourses: j.completed_courses ?? j.completedCourses ?? 0,
                    duration: j.duration_hours ? `${j.duration_hours}h` : (j.duration ?? ''),
                    level: j.level ?? j.difficulty ?? 'Intermediate',
                    courseList: (j.courseList ?? j.courses_list ?? (Array.isArray(j.courses) ? j.courses : []) ?? []).map((c: any) => ({
                        id: c._id ?? c.id,
                        title: c.course_title ?? c.title ?? '',
                        description: c.description ?? '',
                        link: c.course_url ?? c.url ?? c.link ?? '',
                        duration: c.duration_hours ? `${c.duration_hours}h` : (c.duration ?? ''),
                        completed: c.completed ?? false,
                    })),
                })));
            } catch (e) {
                console.error('Failed to fetch learning journeys:', e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchJourneys();
    }, []);

    const updateProgress = (id: string, delta: number) => {
        setJourneys(prev => prev.map(j => {
            if (j._id !== id) return j;
            const newCompleted = Math.min(j.courses, Math.max(0, j.completedCourses + delta));
            return { ...j, completedCourses: newCompleted, progress: Math.round((newCompleted / j.courses) * 100) };
        }));
    };

    return (
        <Fragment>
            <TabTitle title="Learning Journeys" />
            <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                    <Typography sx={{ fontSize: 13, color: 'grey.500', cursor: 'pointer', '&:hover': { color: BRAND_RED } }}>Learning Programs</Typography>
                    <ChevronRightRounded sx={{ fontSize: 16, color: 'grey.400' }} />
                    <Typography sx={{ fontSize: 13, color: 'grey.800', fontWeight: 600 }}>Program Details</Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="h4" fontWeight={800} sx={{ color: 'grey.900' }}>Learning Journeys</Typography>
                    <Typography sx={{ color: 'grey.500', fontSize: 13, mt: 0.5 }}>
                        Structured learning paths designed to build enterprise skills progressively.
                    </Typography>
                </Box>

                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                        <CircularProgress size={32} sx={{ color: BRAND_RED }} />
                    </Box>
                ) : journeys.length === 0 ? (
                    <Typography sx={{ color: 'grey.500', textAlign: 'center', py: 6 }}>No learning journeys found.</Typography>
                ) : (
                    journeys.map(j => (
                        <JourneyCard key={j._id} journey={j}
                            onClick={() => setSelectedJourney(j)}
                            onProgressChange={(delta) => updateProgress(j._id, delta)}
                        />
                    ))
                )}
            </Box>

            <CourseDetailModal journey={selectedJourney} open={!!selectedJourney} onClose={() => setSelectedJourney(null)} />
        </Fragment>
    );
};

export default LearningJourneys;
