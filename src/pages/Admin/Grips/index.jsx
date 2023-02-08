import React from 'react';
import { Box, Button, Paper, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useLayoutEffect } from 'react';
import {
    fetchAllGrips,
    fetchCreate,
    fetchRemove,
} from '../../../store/reducers/grips/fetch';
import PropTypes from 'prop-types';
import { drawerWidth } from '../../../layouts/Admin';
import PageHeader from '../helpers/PageHeader';
import ListWithSearch from './components/ListWithSearch';

function Grips() {
    const { grips } = useSelector((state) => state.grip);
    const dispatch = useDispatch();

    const [grip, setGrip] = React.useState('');

    const contentWidth = window.innerWidth - drawerWidth;

    const handleGripChange = (e) => setGrip(e.target.value);
    const handleGripSubmit = () => {
        dispatch(fetchCreate({ title: grip }));
        setGrip('');
    };
    const handleGripRemove = (id) => dispatch(fetchRemove(id));

    useLayoutEffect(() => {
        dispatch(fetchAllGrips());
    }, []);

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            <PageHeader title={'GRIPS'} description={'Manage grips'} />
            <Box
                display="flex"
                gap={1}
                sx={{ width: contentWidth <= 768 ? '100%' : '50%' }}
                margin={contentWidth <= 768 ? 0 : '0 auto'}
                maxHeight="calc(100vh - 11rem)"
                overflow="auto"
            >
                <ListWithSearch
                    arr={grips}
                    textKey={'title'}
                    onDelete={handleGripRemove}
                />
                <Paper
                    variant="outlined"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        p: 2,
                        height: '100%',
                    }}
                >
                    <TextField
                        label="Grip"
                        value={grip}
                        onChange={handleGripChange}
                    />
                    <Button variant="outlined" onClick={handleGripSubmit}>
                        Add grip
                    </Button>
                </Paper>
            </Box>
        </Box>
    );
}

Grips.propTypes = {
    props: PropTypes.object,
};

export default Grips;
