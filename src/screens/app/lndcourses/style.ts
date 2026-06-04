import { useMUITheme } from '../../../hooks/useMUITheme';

export const useStyle = () => {
  const theme = useMUITheme();
  const { palette: { text, grey, primary, error } } = theme;

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
    formCard: {
      borderRadius: '12px',
      boxShadow: 'none',
      border: `1px solid ${grey[200]}`,
      mb: 4,
      p: 2
    },
    formHeaderTitle: {
      fontWeight: 700,
      color: text?.primary,
      mb: 3
    },
    inputField: {
      '& .MuiOutlinedInput-root': {
        borderRadius: '8px'
      }
    },
    submitButton: {
      backgroundColor: error?.main,
      color: '#fff',
      textTransform: 'none',
      fontWeight: 600,
      borderRadius: '8px',
      padding: '10px 30px',
      '&:hover': {
        backgroundColor: error?.dark
      },
      display: 'flex',
      flex: 0.3
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
    tableTextBase: {
      color: grey[700],
      fontWeight: 500
    },
    tableTextPrimary: {
      fontWeight: 700,
      color: text?.primary
    }
  };
};
