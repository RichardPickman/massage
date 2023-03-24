import React from 'react';
import { InputLabel, FormControl as Form, Select } from '@mui/material';
import PropTypes from 'prop-types';


export const FormControl = ({ children, label, value, onClick }) => {
  return (
    <Form fullWidth>
        <InputLabel id={`${label}-label`}>{label}</InputLabel>
        <Select
            labelId={`${label}-label`}
            value={value}
            label={label}
            onChange={onClick}
        >
            {children}
        </Select>
    </Form>
  );
};

FormControl.propTypes = {
    children: PropTypes.node,
    onClick: PropTypes.func,
    label: PropTypes.string,
    value: PropTypes.string,
};
