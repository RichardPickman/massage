import React from 'react';
import { TextField } from '@mui/material';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import PropTypes from 'prop-types';

function Time({ value, onChange }) {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
                label="Time"
                ampm={false}
                value={value}
                onChange={onChange}
                renderInput={(params) => <TextField {...params} />}
            />
        </LocalizationProvider>
    );
}

Time.propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func,
};

export default Time;
