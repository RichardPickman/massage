import { Box, Stack, Typography } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { fetchStatuses } from '../../../utils/consts';

function AdminInfo() {
    const auth = useSelector((state) => state.auth);

    if (auth.status !== fetchStatuses.SUCCEEDED) {
        return <div>Loading...</div>;
    }

    if (auth.status === fetchStatuses.SUCCEEDED) {
        return (
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                margin={2}
                gap={2}
            >
                <Box>
                    <Box
                        component="img"
                        src="https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Fi.ytimg.com%2Fvi%2FGl0yOmn25hg%2Fmaxresdefault.jpg&sp=1675116964T2931bd93e25864742abe0a4da545fddaf4f5e025dfd059af699a6cafd10545b4"
                        sx={{
                            borderRadius: '50%',
                            objectFit: 'cover',
                            height: 100,
                            width: 100,
                        }}
                    />
                </Box>
                <Stack direction="column" spacing={1} alignItems="center">
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {auth.user.nickname}
                    </Typography>
                    <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        {auth.user.email}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ flexGrow: 1 }}
                        color="#71aaeb"
                    >
                        {auth.user.role}
                    </Typography>
                </Stack>
            </Box>
        );
    }
}

export default AdminInfo;
