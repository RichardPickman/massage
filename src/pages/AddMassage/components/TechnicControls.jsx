import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Grid, TextField } from '@mui/material';

function TechnicControls({ appendTechnic, setTemplate, setTitle }) {
    const [technicField, setTechnicField] = useState('');

    const { innerWidth } = window;

    const handleAppend = () => {
        appendTechnic(technicField);
        setTechnicField('');
    };

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            <TextField
                onChange={setTitle}
                label="Title"
                size="small"
            ></TextField>
            <Grid
                container
                direction={innerWidth <= 768 ? 'column' : 'row'}
                spacing={2}
            >
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        value={technicField}
                        label="Technic"
                        onChange={(e) => setTechnicField(e.target.value)}
                        size="small"
                    />
                </Grid>
                <Grid item xs={3}>
                    <Button fullWidth variant="outlined" onClick={handleAppend}>
                        Append
                    </Button>
                </Grid>
                <Grid item xs={3}>
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => setTemplate()}
                    >
                        Template
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}

TechnicControls.propTypes = {
    setTechnicField: PropTypes.func,
    appendTechnic: PropTypes.func,
    setTemplate: PropTypes.func,
    setTitle: PropTypes.func,
};

export default TechnicControls;
