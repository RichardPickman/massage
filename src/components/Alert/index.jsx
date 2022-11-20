import { Button, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';

export default function Alert({ status, onClose, path, text }) {
    return status === 'successful' ? (
        <Alert
            severity="success"
            action={
                <Button size="small">
                    <Link underline="none" to={path} component={RouterLink}>
                        Quiz
                    </Link>
                </Button>
            }
        >
            {text}
        </Alert>
    ) : (
        <Alert severity="error" onClose={onClose}>
            {text}
        </Alert>
    );
}

Alert.propTypes = {
    status: PropTypes.string,
    onClose: PropTypes.func,
    path: PropTypes.string,
    text: PropTypes.string,
};
