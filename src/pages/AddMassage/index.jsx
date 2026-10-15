import React, { useLayoutEffect } from 'react';
import { useLoaderData } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { Card } from '../../components/ui/card';
import GripService from '../../services/Grip';
import { clearData } from '../../store/reducers/massage';
import { fetchCreate } from '../../store/reducers/massage/fetch';
import { fetchStatuses } from '../../utils/consts';
import Alert from './components/Alert';
import { getDraggableGrip } from './components/helpers';
import ListWithSearch from './components/ListWithSearch';
import TechnicControls from './components/TechnicControls';
import TechnicsList from './components/TechnicsList';

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
        <Card>
            {isSaved && <Alert />}
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <Card
                        gap={2}
                        overflow="auto"
                        flex
                        sx={{ maxHeight: '80vh' }}
                    >
                        <TechnicControls />
                        <TechnicsList />
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card gap={2} flex sx={{ maxHeight: '80vh' }}>
                        {loaderData && (
                            <ListWithSearch
                                arr={loaderData.grips}
                                textKey={'title'}
                            />
                        )}
                        <Stack>
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
                    </Card>
                </Grid>
            </Grid>
        </Card>
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
