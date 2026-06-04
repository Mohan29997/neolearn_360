import { Fragment, useEffect } from 'react';
import { GlobalStyles } from './theme/globalstyles';
import { Box, Container, LinearProgress, Typography } from '@mui/material';
import { StorageManager } from './storagemanager';
import { setIsLogin } from './store/reducer/AuthHelper';
import { useAppSelector } from './hooks/useAppSelector';
import { useAppDispatch } from './hooks/useAppDispatch';
import AuthNavigation from './navigation/authnavigation';
import AppNavigation from './navigation/appnavigation';
import { useMUITheme } from './hooks/useMUITheme';

function App() {
  const theme = useMUITheme();
  const dispatch = useAppDispatch();
  const { isLogin = null } = useAppSelector((state) => state?.authHelper);

  useEffect(() => {
    const isToken = StorageManager.getAccessToken()
    if (isToken) {
      dispatch(setIsLogin({ isLogin: true }));
    } else {
      dispatch(setIsLogin({ isLogin: false }));
    }
  }, []);

  if (isLogin === null) {
    return (
      <Fragment>
        <Box sx={{ position: "absolute", top: 0, zIndex: 9999, width: "100%" }}>
          <LinearProgress variant="indeterminate" />
        </Box>
        <Container>
          <Box sx={{ height: "100vh", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <Typography variant='h2' sx={{ userSelect: "none", color: theme.palette.error.dark, pt: 1, pb: .3 }}>Neo Learn 360</Typography>
            <Typography variant="subtitle1" sx={{ /* color: "#005baa", */ userSelect: "none", pb: 1 }}>Please wait we're setting up something for you.</Typography>
          </Box>
        </Container>
      </Fragment>
    )
  }
  return (
    <Fragment>
      <GlobalStyles theme={theme} />
      {!isLogin ?
        <AppNavigation />
        :
        <AuthNavigation />
      }
    </Fragment>
  );
}

export default App;
