import { Button, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';

export default function Alert({ status, onClose, path }) {
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
            Quiz successfully added. You may add another quiz
        </Alert>
    ) : (
        <Alert severity="error" onClose={onClose}>
            Something went wrong
        </Alert>
    );
}

Alert.propTypes = {
    status: PropTypes.string,
    onClose: PropTypes.func,
    path: PropTypes.string,
};
