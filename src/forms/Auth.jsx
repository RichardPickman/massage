import { Box, Button, Link, Stack, TextField, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import Alert from '../components/Alert';
import { alertStatuses } from '../utils/consts';

function Auth({ submitting, errorData, onSubmit, header }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmail = (e) => setEmail(e.target.value);
    const handlePassword = (e) => setPassword(e.target.value);

    const ErrorHandler = () => {
        const error = alertStatuses.FAIL;

        if (errorData.message === 'Validation error') {
            return errorData.errors.map((err) => (
                <Alert
                    key={err.param}
                    status={error}
                    text={
                        err.param === 'email'
                            ? `Invalid ${err.param}`
                            : 'Password must contain at least 6 characters and less then 32'
                    }
                />
            ));
        }

        return <Alert status={error} text={errorData.message} />;
    };

    return (
        <Box margin="20% auto" width="50%">
            <Stack direction="column" spacing={2} alignItems="center">
                <AccountCircleOutlinedIcon fontSize="large" />
                <Typography variant="h4">{header}</Typography>
                {errorData && <ErrorHandler />}
                <TextField
                    required
                    autoFocus
                    autoComplete="on"
                    value={email}
                    onChange={handleEmail}
                    label="Email Address"
                />
                <TextField
                    required
                    value={password}
                    onChange={handlePassword}
                    type="password"
                    label="Password"
                />
                <Button
                    variant="outlined"
                    disabled={submitting}
                    onClick={() => onSubmit({ email, password })}
                >
                    {submitting ? 'Submitting...' : 'Submit'}
                </Button>
                {header === 'Sign In' && (
                    <Link
                        underline="none"
                        to={'/auth/recover'}
                        component={RouterLink}
                    >
                        Forgot password?
                    </Link>
                )}
            </Stack>
        </Box>
    );
}

Auth.propTypes = {
    header: PropTypes.string,
    submitting: PropTypes.bool,
    onSubmit: PropTypes.func,
    errorData: PropTypes.object,
};

export default Auth;
