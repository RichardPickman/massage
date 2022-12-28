import { Button, Link, Alert as AlertStyle, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';

export default function Alert({ status, onClose, path, text, title }) {
    return status === 'successful' ? (
        <AlertStyle
            severity="success"
            action={
                <Button size="small">
                    <Link underline="none" to={path} component={RouterLink}>
                        {title}
                    </Link>
                </Button>
            }
            onClose={onClose}
        >
            <Typography variant="body1">{text}</Typography>
        </AlertStyle>
    ) : (
        <AlertStyle severity="error" onClose={onClose}>
            <Typography variant="body1">{text}</Typography>
        </AlertStyle>
    );
}

Alert.propTypes = {
    status: PropTypes.string,
    onClose: PropTypes.func,
    path: PropTypes.string,
    text: PropTypes.string,
    title: PropTypes.string,
};
