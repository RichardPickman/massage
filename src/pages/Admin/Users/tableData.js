import React from 'react';
import { Box, Checkbox, Stack, Typography } from '@mui/material';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

export const columns = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'nickname', headerName: 'Nickname', flex: 1, align: 'left' },
    { field: 'email', headerName: 'Email', flex: 1, align: 'left' },
    {
        field: 'role',
        headerName: 'Role',
        headerAlign: 'center',
        flex: 1,
        align: 'center',
        renderCell: ({ row: { role } }) => {
            return (
                <Box
                    m="0 auto"
                    w="60%"
                    p="5px"
                    display="flex"
                    justifyContent="center"
                    backgroundColor="#71aaeb"
                    borderRadius="4px"
                >
                    <Stack direction="row" spacing={1}>
                        {role === 'admin' && <AdminPanelSettingsOutlinedIcon />}
                        {role === 'user' && <AccountCircleOutlinedIcon />}
                        <Typography variant="body1">{role}</Typography>
                    </Stack>
                </Box>
            );
        },
    },
    {
        field: 'isActivated',
        headerName: 'Activated',
        align: 'center',
        renderCell: ({ row: { isActivated } }) => (
            <Checkbox checked={isActivated} />
        ),
    },
];
