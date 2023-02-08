import { Button, Grid, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    addTechnic,
    addTemplateTechnics,
} from '../../../../store/reducers/massage';

function Technics() {
    const dispatch = useDispatch();

    const [technicTitle, setTechnicTitle] = useState('');

    const handleAppend = () => {
        dispatch(addTechnic({ title: technicTitle }));
    };

    const handleTemplate = () => {
        dispatch(addTemplateTechnics());
    };

    const handleTechnicChange = (e) => setTechnicTitle(e.target.value);

    return (
        <Grid
            container
            direction={innerWidth <= 768 ? 'column' : 'row'}
            spacing={2}
        >
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    value={technicTitle}
                    label="Technic"
                    onChange={handleTechnicChange}
                    size="small"
                />
            </Grid>
            <Grid item xs={3}>
                <Button fullWidth variant="outlined" onClick={handleAppend}>
                    Append
                </Button>
            </Grid>
            <Grid item xs={3}>
                <Button fullWidth variant="outlined" onClick={handleTemplate}>
                    Template
                </Button>
            </Grid>
        </Grid>
    );
}

export default Technics;
