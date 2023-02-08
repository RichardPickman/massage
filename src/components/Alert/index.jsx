import { Alert as StyledAlert } from '@mui/material';
import React from 'react';
import { alertStatuses } from '../../utils/consts';
import PropTypes from 'prop-types';

function Alert({ status, text }) {
    if (status === alertStatuses.SUCCESS) {
        return <StyledAlert severity="success">{text}</StyledAlert>;
    }

    if (status === alertStatuses.FAIL) {
        return <StyledAlert severity="error">{text}</StyledAlert>;
    }
}

Alert.propTypes = {
    status: PropTypes.string,
    text: PropTypes.string,
};

export default Alert;
