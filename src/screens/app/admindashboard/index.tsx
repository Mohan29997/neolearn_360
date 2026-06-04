import { alpha } from '@mui/material/styles';
import { Fragment } from 'react';
import { useStyle } from './style';

import {
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Domain as DomainIcon,
  FilterList as FilterListIcon,
  GetApp as GetAppIcon,
  MenuBook as MenuBookIcon,
  PeopleAlt as PeopleAltIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { useMUITheme } from '../../../hooks/useMUITheme';
import { lightPalette } from '../../../theme/palette';

const learners = [
  {
    initials: 'RK',
    name: 'Rohan K.',
    email: 'rohan.k@neosoft.com',
    program: 'Advanced React Architecture',
    department: 'Engineering',
    progress: 92,
    status: 'Deployment Ready',
    statusColor: 'success'
  },
  {
    initials: 'AM',
    name: 'Ananya M.',
    email: 'ananya.m@neosoft.com',
    program: 'AI/ML Fundamentals',
    department: 'Data Science',
    progress: 88,
    status: 'Review Required',
    statusColor: 'warning'
  },
  {
    initials: 'ST',
    name: 'Siddharth T.',
    email: 'sid.t@neosoft.com',
    program: 'Enterprise Cybersecurity',
    department: 'IT Ops',
    progress: 100,
    status: 'Deployment Ready',
    statusColor: 'success'
  }
];

const AdminDashboard = () => {
  const styles = useStyle();
  const { palette: { success, error, warning } } = useMUITheme();

  return (
    <Fragment>
      {/* <TabTitle title='Admin Dashboard' /> */}
      <Box sx={styles.container}>

        {/* Header Section */}
        <Box sx={styles.headerContainer}>
          <Box sx={styles.headerTextContainer}>
            <Typography variant="h4" sx={styles.headerTitle}>
              Organization Overview
            </Typography>
            <Typography variant="body1" sx={styles.headerSubtitle}>
              Real-time performance and readiness metrics
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={styles.createButton}
          >
            Create New Program
          </Button>
        </Box>

        {/* Top Cards Section */}
        <Grid container spacing={3} sx={styles.cardsGrid}>
          {/* Card 1: Total Users */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={styles.card}>
              <CardContent sx={styles.cardContent}>
                <Box sx={styles.cardHeader}>
                  <Box>
                    <Typography sx={styles.cardTitle}>
                      Total Users
                    </Typography>
                    <Box sx={styles.cardStatContainer}>
                      <Typography variant="h4" sx={styles.cardValue}>
                        1,248
                      </Typography>
                      <Typography sx={styles.cardStatUp}>
                        +12% <TrendingUpIcon sx={{ fontSize: '1rem', ml: 0.5 }} />
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <PeopleAltIcon sx={styles.cardIcon} />
              </CardContent>
            </Card>
          </Grid>

          {/* Card 2: Departments */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={styles.card}>
              <CardContent sx={styles.cardContent}>
                <Typography sx={styles.cardTitle}>
                  Departments
                </Typography>
                <Box sx={styles.cardStatContainer}>
                  <Typography variant="h4" sx={styles.cardValue}>
                    14
                  </Typography>
                  <Typography sx={styles.cardStatNeutral}>
                    Static
                  </Typography>
                </Box>
                <DomainIcon sx={styles.cardIcon} />
              </CardContent>
            </Card>
          </Grid>

          {/* Card 3: Active Learning Programs */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={styles.card}>
              <CardContent sx={styles.cardContent}>
                <Typography sx={styles.cardTitle}>
                  Active Learning Programs
                </Typography>
                <Box sx={styles.cardStatContainer}>
                  <Typography variant="h4" sx={styles.cardValue}>
                    32
                  </Typography>
                  <Typography sx={styles.cardStatLive}>
                    Live
                  </Typography>
                </Box>
                <MenuBookIcon sx={styles.cardIcon} />
              </CardContent>
            </Card>
          </Grid>

          {/* Card 4: Deployment Ready */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={styles.cardDeploymentReady}>
              <CardContent sx={styles.cardContent}>
                <Typography sx={styles.cardTitleReady}>
                  Deployment Ready
                </Typography>
                <Box sx={styles.cardStatContainer}>
                  <Typography variant="h4" sx={styles.cardValueReady}>
                    87
                  </Typography>
                  <Typography sx={styles.cardStatReady}>
                    Learners
                  </Typography>
                </Box>
                <CheckCircleIcon sx={styles.cardIconReady} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={styles.chartsGrid}>
          {/* Bar Chart Placeholder Area */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={styles.chartCard}>
              <CardContent sx={styles.chartCardContent}>
                <Box sx={styles.chartHeader}>
                  <Box>
                    <Typography variant="h6" sx={styles.chartHeaderTitle}>
                      Learning Progress by Dept
                    </Typography>
                    <Typography variant="body2" sx={styles.chartHeaderSubtitle}>
                      Completion rates across major divisions
                    </Typography>
                  </Box>
                  <Button variant="outlined" sx={styles.last30DaysBtn}>
                    Last 30 Days
                  </Button>
                </Box>

                <Box sx={styles.chartBarContainer}>
                  {/* Mock Bar Chart Elements */}
                  <Box sx={styles.chartBarMock}>
                    {/* Intentionally left blank to match mockup aesthetic, normally a chart goes here */}
                  </Box>

                  {['Engineering', 'Product', 'Sales', 'HR', 'Marketing'].map((dept) => (
                    <Typography key={dept} variant="body2" sx={styles.chartLabel}>
                      {dept}
                    </Typography>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Skill Readiness Donut Chart Area */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={styles.chartCard}>
              <CardContent sx={styles.cardContent}>
                <Typography variant="h6" sx={styles.chartHeaderTitle}>
                  Skill Readiness
                </Typography>

                <Box sx={styles.donutContainer}>
                  <Box sx={styles.donutWrapper}>
                    {/* SVG Donut Chart */}
                    <svg viewBox="0 0 100 100" width="100%" height="100%">
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke={(lightPalette.grey as any)[200]} strokeWidth="12" />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke={error?.main}
                        strokeWidth="12"
                        strokeDasharray="251.2"
                        strokeDashoffset="75.36"
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <Box sx={styles.donutTextContainer}>
                      <Typography variant="h3" sx={styles.donutChartTextPrimary}>
                        70%
                      </Typography>
                      <Typography variant="body2" sx={styles.donutChartTextSecondary}>
                        Expert Ready
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={styles.donutLegendContainer}>
                  <Box sx={styles.legendItem}>
                    <Typography variant="body2" sx={styles.legendLabel}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: error?.main, mr: 1.5 }} />
                      Full Stack
                    </Typography>
                    <Typography variant="body2" sx={styles.legendValue}>42%</Typography>
                  </Box>
                  <Box sx={styles.legendItem}>
                    <Typography variant="body2" sx={styles.legendLabel}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: error?.light, mr: 1.5 }} />
                      Data Eng
                    </Typography>
                    <Typography variant="body2" sx={styles.legendValue}>28%</Typography>
                  </Box>
                  <Box sx={styles.legendItemLast}>
                    <Typography variant="body2" sx={styles.legendLabel}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: (lightPalette.grey as any)[200], mr: 1.5 }} />
                      Others
                    </Typography>
                    <Typography variant="body2" sx={styles.legendValue}>30%</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Table Section */}
        <Card sx={styles.tableCard}>
          <Box sx={styles.tableHeader}>
            <Typography variant="h6" sx={styles.tableHeaderTitle}>
              Deployment Pipeline
            </Typography>
            <Box sx={styles.tableActionContainer}>
              <Button startIcon={<FilterListIcon />} sx={styles.tableActionBtn}>
                Filter
              </Button>
              <Button startIcon={<GetAppIcon />} sx={styles.tableActionBtn}>
                Export
              </Button>
            </Box>
          </Box>
          <TableContainer>
            <Table>
              <TableHead sx={styles.tableHead}>
                <TableRow>
                  <TableCell sx={styles.tableCellHeader}>LEARNER NAME</TableCell>
                  <TableCell sx={styles.tableCellHeader}>CURRENT PROGRAM</TableCell>
                  <TableCell sx={styles.tableCellHeader}>DEPARTMENT</TableCell>
                  <TableCell sx={styles.tableCellHeader}>PROGRESS</TableCell>
                  <TableCell sx={styles.tableCellHeader}>STATUS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {learners.map((learner, index) => (
                  <TableRow key={index} sx={styles.tableRow}>
                    <TableCell>
                      <Box sx={styles.learnerCell}>
                        <Avatar sx={{
                          ...styles.learnerAvatarBase,
                          bgcolor: learner.statusColor === 'warning' ? alpha(warning?.main as string, 0.1) : alpha(error?.main as string, 0.1),
                          color: learner.statusColor === 'warning' ? warning?.dark : error?.main,
                        }}>
                          {learner.initials}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={styles.tableLearnerName}>
                            {learner.name}
                          </Typography>
                          <Typography variant="body2" sx={styles.tableLearnerEmail}>
                            {learner.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={styles.tableProgramText}>
                        {learner.program}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={styles.tableDeptText}>
                        {learner.department}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={styles.progressContainer}>
                        <Typography variant="body2" sx={styles.progressText}>
                          {learner.progress}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={learner.progress}
                        sx={styles.progressBar}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={learner.status}
                        size="small"
                        sx={{
                          ...styles.chipBase,
                          backgroundColor: learner.statusColor === 'success' ? alpha(success?.main as string, 0.1) : alpha(warning?.main as string, 0.1),
                          color: learner.statusColor === 'success' ? success?.dark : warning?.dark,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={styles.tableFooter}>
            <Typography variant="body2" sx={styles.tableFooterText}>
              Showing 3 of 87 ready learners
            </Typography>
            <Box>
              <IconButton size="small" sx={styles.footerBtnLeft}>
                <ChevronLeftIcon />
              </IconButton>
              <IconButton size="small" sx={styles.footerBtnRight}>
                <ChevronRightIcon />
              </IconButton>
            </Box>
          </Box>
        </Card>
      </Box>
    </Fragment>
  );
};

export default AdminDashboard;