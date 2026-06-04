import React, { Fragment, useLayoutEffect, useState } from 'react';
import type { ComponentType } from 'react';
import { Box, Container, LinearProgress, Typography } from '@mui/material';
import { service } from '../../service';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useMUITheme } from '../../hooks/useMUITheme';
import { setProfile } from '../../store/reducer/AdminProfile';

const AppUtils = <P extends object>(ConsumerComponent: ComponentType<P>) => {
    const WrappedComponent: React.FC<P> = (props) => {
        const { palette } = useMUITheme();
        const dispatch = useAppDispatch();
        const [isLoading, setIsLoading] = useState<boolean>(true);

        useLayoutEffect(() => {
            (async () => {
                service.getuserprofile()
                    .then((response) => {
                        if (response.status === 200) {
                            dispatch(setProfile(response.data))
                        }
                    })
                    .catch(() => { })
                    .finally(() => { setIsLoading(false) })
            })()
        }, []);

        if (isLoading) {
            return (
                <Fragment>
                    <Box sx={{ position: "absolute", top: 0, zIndex: 9999, width: "100%" }}>
                        <LinearProgress variant="indeterminate" />
                    </Box>
                    <Container>
                        <Box sx={{ height: "100vh", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                            <Typography variant='h2' sx={{ userSelect: "none", color: palette.error.dark, pt: 1, pb: .3 }}>Neo Learn 360</Typography>
                            <Typography variant="subtitle1" sx={{ /* color: "#005baa", */ userSelect: "none", pb: 1 }}>Please wait we're setting up something for you.</Typography>
                        </Box>
                    </Container>
                </Fragment>
            );
        }

        return <ConsumerComponent {...props} />;
    };

    WrappedComponent.displayName = `AppUtils(${ConsumerComponent.displayName || ConsumerComponent.name || 'Component'})`;

    return WrappedComponent;
};

export default AppUtils;
