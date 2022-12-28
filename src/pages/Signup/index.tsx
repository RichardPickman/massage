import {
    Card,
    CardContent,
    Box,
    Typography,
    TextField,
    Button,
    Link,
} from '@mui/material';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

function Signup() {
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
                        <TextField label="Password" type="password" />
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
}

export default Signup;
