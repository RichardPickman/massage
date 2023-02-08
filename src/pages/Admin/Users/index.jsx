import React from 'react';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import UserService from '../../../services/User';
import { useLoaderData } from 'react-router-dom';
import { columns } from './tableData';
import PageHeader from '../helpers/PageHeader';

function Users() {
    const loadData = useLoaderData();

    return (
        <Box
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            height="calc(100vh - 5rem)"
        >
            <PageHeader title={'USERS'} description={'Manage users'} />
            <DataGrid
                rows={loadData}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
                disableSelectionOnClick
                experimentalFeatures={{ newEditingApi: true }}
            />
        </Box>
    );
}

export const loader = async () => {
    const payload = await UserService.getAll();

    if (!payload) {
        throw { message: 'Something went wrong' };
    }

    return payload;
};

export default Users;
