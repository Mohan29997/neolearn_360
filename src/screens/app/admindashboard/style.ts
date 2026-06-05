import { alpha } from '@mui/material/styles';
import { useMUITheme } from '../../../hooks/useMUITheme';

export const useStyle = () => {
  const theme = useMUITheme();
  const { palette: { success, error, text, grey } } = theme;

  return {
    container: {
      p: 4,
      backgroundColor: grey[50],
      minHeight: '100vh',
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
    },
    headerContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      mb: 4
    },
    headerTextContainer: {
      display: 'flex',
      flexDirection: 'column',
      flex: 0.7
    },
    headerTitle: {
      fontWeight: 800,
      color: text?.primary,
      mb: 0.5
    },
    headerSubtitle: {
      color: grey[500]
    },
    createButton: {
      backgroundColor: error?.main,
      color: '#fff',
      textTransform: 'none',
      fontWeight: 600,
      borderRadius: '8px',
      padding: '10px 20px',
      '&:hover': {
        backgroundColor: error?.dark
      },
      display: 'flex',
      flex: 0.3
    },
    cardsGrid: { mb: 4 },
    card: {
      borderRadius: '12px',
      boxShadow: 'none',
      border: `1px solid ${grey[200]}`,
      position: 'relative',
      overflow: 'hidden'
    },
    cardDeploymentReady: {
      borderRadius: '12px',
      boxShadow: 'none',
      border: `1px solid ${alpha(error?.main as string, 0.3)}`,
      backgroundColor: alpha(error?.main as string, 0.05),
      position: 'relative',
      overflow: 'hidden'
    },
    cardContent: { p: 3 },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    },
    cardStatContainer: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 1
    },
    cardTitle: {
      color: grey[500],
      fontSize: '0.875rem',
      fontWeight: 600,
      mb: 1
    },
    cardTitleReady: {
      color: error?.main,
      fontSize: '0.875rem',
      fontWeight: 600,
      mb: 1
    },
    cardValue: {
      fontWeight: 800,
      color: text?.primary
    },
    cardValueReady: {
      fontWeight: 800,
      color: error?.main
    },
    cardStatUp: {
      color: success?.main,
      fontSize: '0.875rem',
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center'
    },
    cardStatNeutral: {
      color: grey[500],
      fontSize: '0.875rem',
      fontWeight: 500
    },
    cardStatLive: {
      color: error?.main,
      fontSize: '0.875rem',
      fontWeight: 600
    },
    cardStatReady: {
      color: error?.main,
      fontSize: '0.875rem',
      fontWeight: 600
    },
    cardIcon: {
      position: 'absolute',
      right: -10,
      bottom: -10,
      fontSize: 100,
      color: grey[100],
      zIndex: 0
    },
    cardIconReady: {
      position: 'absolute',
      right: -20,
      bottom: -20,
      fontSize: 120,
      color: alpha(error?.main as string, 0.1),
      zIndex: 0,
      opacity: 0.8
    },
    chartsGrid: { mb: 4 },
    chartCard: {
      borderRadius: '12px',
      boxShadow: 'none',
      border: `1px solid ${grey[200]}`,
      height: '100%',
      minHeight: '350px',
      display: 'flex',
      flexDirection: 'column'
    },
    chartCardContent: {
      p: 3,
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column'
    },
    chartHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      mb: 4
    },
    chartHeaderTitle: {
      fontWeight: 700,
      color: text?.primary
    },
    chartHeaderSubtitle: {
      color: grey[500]
    },
    last30DaysBtn: {
      color: grey[700],
      borderColor: grey[300],
      textTransform: 'none',
      backgroundColor: grey[50]
    },
    chartBarContainer: {
      flexGrow: 1,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-around',
      pb: 2,
      position: 'relative'
    },
    chartBarMock: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 0,
      opacity: 0
    },
    chartLabel: {
      color: grey[500],
      fontWeight: 600,
      zIndex: 1
    },
    donutContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      mb: 4
    },
    donutWrapper: {
      position: 'relative',
      width: 200,
      height: 200
    },
    donutTextContainer: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center'
    },
    donutChartTextPrimary: {
      fontWeight: 800,
      color: error?.main,
      lineHeight: 1
    },
    donutChartTextSecondary: {
      color: grey[500],
      fontWeight: 600
    },
    donutLegendContainer: { px: 2 },
    legendItem: {
      display: 'flex',
      justifyContent: 'space-between',
      mb: 1.5
    },
    legendItemLast: {
      display: 'flex',
      justifyContent: 'space-between'
    },
    legendLabel: {
      color: grey[700],
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center'
    },
    legendValue: {
      fontWeight: 700
    },
    tableCard: {
      borderRadius: '12px',
      boxShadow: 'none',
      border: `1px solid ${grey[200]}`
    },
    tableHeader: {
      p: 3,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: `1px solid ${grey[200]}`
    },
    tableHeaderTitle: {
      fontWeight: 700,
      color: text?.primary
    },
    tableActionContainer: {
      display: 'flex',
      gap: 2
    },
    tableActionBtn: {
      color: grey[700],
      textTransform: 'none',
      fontWeight: 600
    },
    tableHead: {
      backgroundColor: grey[50]
    },
    tableRow: {
      '&:last-child td, &:last-child th': { border: 0 }
    },
    tableCellHeader: {
      color: grey[500],
      fontWeight: 600,
      fontSize: '0.75rem',
      letterSpacing: '0.05em'
    },
    learnerCell: {
      display: 'flex',
      alignItems: 'center'
    },
    learnerAvatarBase: {
      width: 40,
      height: 40,
      mr: 2,
      fontSize: '1rem',
      fontWeight: 600
    },
    tableLearnerName: {
      fontWeight: 700,
      color: text?.primary
    },
    tableLearnerEmail: {
      color: grey[500],
      fontSize: '0.75rem'
    },
    tableProgramText: {
      fontWeight: 500,
      color: grey[700],
      maxWidth: 150
    },
    tableDeptText: {
      color: grey[700]
    },
    progressContainer: {
      display: 'flex',
      alignItems: 'center'
    },
    progressText: {
      fontWeight: 600,
      mr: 1,
      minWidth: 40
    },
    progressBar: {
      height: 6,
      borderRadius: 3,
      backgroundColor: grey[200],
      '& .MuiLinearProgress-bar': {
        backgroundColor: error?.main
      }
    },
    chipBase: {
      fontWeight: 700,
      fontSize: '0.75rem',
      borderRadius: '6px',
      px: 1
    },
    tableFooter: {
      p: 2,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTop: `1px solid ${grey[200]}`
    },
    tableFooterText: {
      color: grey[500],
      fontWeight: 500
    },
    footerBtnLeft: {
      border: `1px solid ${grey[200]}`,
      mr: 1,
      borderRadius: '6px'
    },
    footerBtnRight: {
      border: `1px solid ${grey[200]}`,
      borderRadius: '6px'
    }
  }
};
