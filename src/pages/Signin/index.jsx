import React, { useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Link,
    TextField,
    Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { login } from '../../store/reducers/user';
import { useDispatch, useSelector } from 'react-redux';

const Signin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const handleEmail = (event) => setEmail(event.target.value);
    const handlePassword = (event) => setPassword(event.target.value);

    const handleSubmit = () => dispatch(login({ email, password }));

    return (
        <Card
            sx={{
                display: 'inline-flex',
                marginLeft: '50%',
                marginTop: '30%',
                transform: 'translate(-50%, -30%)',
            }}
        >
            <CardContent>
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    gap={2}
                >
                    <Typography variant="h4">Sign In</Typography>
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        flexDirection="column"
                        gap={2}
                    >
                        <TextField
                            value={email}
                            onChange={handleEmail}
                            label="Login"
                        />
                        <TextField
                            value={password}
                            onChange={handlePassword}
                            type="password"
                            label="Password"
                        />
                    </Box>
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        gap={2}
                    >
                        <Button variant="outlined" onClick={handleSubmit}>
                            Submit
                        </Button>
                    </Box>
                    <Link
                        underline="none"
                        to={'/auth/recover'}
                        component={RouterLink}
                    >
                        Forgot password?
                    </Link>
                </Box>
            </CardContent>
        </Card>
    );
};

export default Signin;
