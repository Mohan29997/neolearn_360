import { Fragment } from 'react';
import { Box, Typography, CircularProgress, Chip } from '@mui/material';
import { ChevronRightRounded, RouteRounded, CheckCircleRounded, PendingRounded } from '@mui/icons-material';
import TabTitle from '../../../components/tabtitle';
import { useLearningJourneys } from '../../../features/journeys/hooks/useLearningJourneys';
import { BRAND, SURFACE } from '../../../constants/brand.constants';
import JourneyCard from './JourneyCard';
import CourseDetailModal from './CourseDetailModal';
import { journeyStyles as js } from './LearningJourneys.styles';

const LearningJourneysPage = () => {
  const { journeys, loading, total, selectedJourney, setSelectedJourney } = useLearningJourneys();

  const completed = journeys.filter(j => j.status === 'completed').length;
  const inProgress = journeys.filter(j => j.status === 'in_progress').length;

  return (
    <Fragment>
      <TabTitle title="Learning Journeys" />
      <Box sx={{ width: '100%' }}>
        <Box sx={js.breadcrumb}>
          <Typography sx={js.breadcrumbLink}>Learning Programs</Typography>
          <ChevronRightRounded sx={{ fontSize: 16, color: 'grey.400' }} />
          <Typography sx={js.breadcrumbActive}>Program Details</Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={800} sx={js.pageTitle}>Learning Journeys</Typography>
          <Typography sx={js.pageSub}>Structured learning paths designed to build enterprise skills progressively.</Typography>
        </Box>

        {/* Summary stats */}
        {!loading && journeys.length > 0 && (
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 1.5, borderRadius: '12px', bgcolor: SURFACE.card, border: `1px solid ${SURFACE.border}`, minWidth: 140 }}>
              <RouteRounded sx={{ color: BRAND.red, fontSize: 22 }} />
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: 22, color: 'grey.900', lineHeight: 1 }}>{total}</Typography>
                <Typography sx={{ fontSize: 11, color: 'grey.500', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 }}>Total</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 1.5, borderRadius: '12px', bgcolor: '#EFF6FF', border: '1px solid #BFDBFE', minWidth: 140 }}>
              <PendingRounded sx={{ color: '#2563EB', fontSize: 22 }} />
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: 22, color: '#2563EB', lineHeight: 1 }}>{inProgress}</Typography>
                <Typography sx={{ fontSize: 11, color: '#2563EB', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 }}>In Progress</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 1.5, borderRadius: '12px', bgcolor: '#F0FDF4', border: '1px solid #BBF7D0', minWidth: 140 }}>
              <CheckCircleRounded sx={{ color: '#16A34A', fontSize: 22 }} />
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: 22, color: '#16A34A', lineHeight: 1 }}>{completed}</Typography>
                <Typography sx={{ fontSize: 11, color: '#16A34A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 }}>Completed</Typography>
              </Box>
            </Box>
            {total > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 1.5, borderRadius: '12px', bgcolor: BRAND.redBg, border: `1px solid ${BRAND.redBorder}`, minWidth: 140 }}>
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: 22, color: BRAND.red, lineHeight: 1 }}>
                    {Math.round((completed / total) * 100)}%
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: BRAND.red, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 }}>Completion Rate</Typography>
                </Box>
              </Box>
            )}
          </Box>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={32} sx={{ color: BRAND.red }} />
          </Box>
        ) : journeys.length === 0 ? (
          <Typography sx={{ color: 'grey.500', textAlign: 'center', py: 6 }}>No learning journeys found.</Typography>
        ) : (
          journeys.map(j => (
            <JourneyCard
              key={j._id}
              journey={j}
              onClick={() => setSelectedJourney(j)}
            />
          ))
        )}
      </Box>

      <CourseDetailModal
        journey={selectedJourney}
        open={!!selectedJourney}
        onClose={() => setSelectedJourney(null)}
      />
    </Fragment>
  );
};

export default LearningJourneysPage;
