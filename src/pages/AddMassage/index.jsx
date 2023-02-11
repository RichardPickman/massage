import React, { useLayoutEffect } from 'react';
import { Box, Button, Grid, Stack } from '@mui/material';
import { useLoaderData } from 'react-router-dom';

import GripService from '../../services/Grip';
import ListWithSearch from './components/ListWithSearch';
import TechnicControls from './components/TechnicControls';
import { getDraggableGrip } from './components/helpers';
import TechnicsList from './components/TechnicsList';
import Alert from './components/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStatuses } from '../../utils/consts';
import { fetchCreate } from '../../store/reducers/massage/fetch';
import { clearData } from '../../store/reducers/massage';

function AddMassage() {
    const loaderData = useLoaderData();
    const dispatch = useDispatch();
    const { status, savedMassageId, technics, title } = useSelector(
        (state) => state.massage
    );
    const isSaved = status === fetchStatuses.SUCCEEDED && savedMassageId;

    const handleSave = () => {
        dispatch(fetchCreate({ title, technics }));
    };

    useLayoutEffect(() => {
        dispatch(clearData());
    }, []);

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            {isSaved && <Alert />}
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <Box
                        gap={2}
                        display="flex"
                        overflow="auto"
                        flexDirection="column"
                        sx={{ maxHeight: '80vh' }}
                    >
                        <TechnicControls />
                        <TechnicsList />
                    </Box>
                </Grid>
                <Grid item xs={4}>
                    <Box
                        gap={2}
                        display="flex"
                        flexDirection="column"
                        sx={{ maxHeight: '80vh' }}
                    >
                        {loaderData && (
                            <ListWithSearch
                                arr={loaderData.grips}
                                textKey={'title'}
                            />
                        )}
                        <Stack direction="column" spacing={1}>
                            <Button
                                fullWidth
                                variant="outlined"
                                color="success"
                                onClick={handleSave}
                            >
                                Save
                            </Button>
                            <Button fullWidth variant="outlined" color="error">
                                Delete
                            </Button>
                        </Stack>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

export default AddMassage;

export const loader = async () => {
    const response = await GripService.getAllGrips();

    const grips = response.map((item) => getDraggableGrip(item));

    return {
        grips: grips,
    };
};
