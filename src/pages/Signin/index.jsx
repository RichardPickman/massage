import React from 'react';
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

const Signin = () => {
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
                        <TextField label="Login" />
                        <TextField type="password" label="Password" />
                    </Box>
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        gap={2}
                    >
                        <Button variant="outlined">
                            <Link
                                underline="none"
                                to={''}
                                component={RouterLink}
                            >
                                Submit
                            </Link>
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
