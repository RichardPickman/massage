import React from 'react';
import { Stack, TextField, Typography } from '@mui/material';
import { drawerWidth } from '../../../../layouts/Admin';
import PropTypes from 'prop-types';

function InputWithLabel({
    caption,
    value,
    onChange,
    label = '',
    isError = false,
    helperText = '',
}) {
    const width = window.innerWidth - drawerWidth;

    return (
        <Stack
            direction="row"
            justifyContent={width <= 768 ? 'space-between' : 'right'}
            alignItems="center"
            spacing={1}
        >
            <Typography variant="caption">{caption}:</Typography>
            <TextField
                value={value}
                onChange={onChange}
                label={label}
                error={isError}
                helperText={helperText}
            />
        </Stack>
    );
}

InputWithLabel.propTypes = {
    caption: PropTypes.string,
    value: PropTypes.string,
    label: PropTypes.string,
    onChange: PropTypes.func,
    isError: PropTypes.bool,
    helperText: PropTypes.string,
};

export default InputWithLabel;
