import React from 'react';
import PropTypes from 'prop-types';
import Card from './showCard';
import { Box, Button, Grid } from '@mui/material';
import EditCard from '../EditTeacher';
import { useState } from 'react';

function Controls({ teacher, onSave }) {
    const [isEdit, setIsEdit] = useState(false);

    const handleEdit = (bool) => setIsEdit(bool);

    return (
        <>
            {isEdit && (
                <Grid item key={teacher.id} xs={12} sm={12} lg={12}>
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="end"
                        gap={1}
                    >
                        <EditCard
                            teacher={teacher}
                            onSave={onSave}
                            onCancel={() => setIsEdit(false)}
                        />
                    </Box>
                </Grid>
            )}
            {!isEdit && (
                <Grid item key={teacher.id} xs={12} sm={12} lg={6}>
                    <Card teacher={teacher} />
                    <Button variant="outlined" onClick={() => handleEdit(true)}>
                        Edit
                    </Button>
                </Grid>
            )}
        </>
    );
}

Controls.propTypes = {
    teacher: PropTypes.object,
    onSave: PropTypes.func,
};

export default Controls;
