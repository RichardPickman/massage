import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Link } from '@mui/material';
import { Link as RouterLink, useLoaderData } from 'react-router-dom';
import { getTableRows, columns } from './helpers';
import LectureService from '../../services/Lecture';
import { useSelector } from 'react-redux';

const Lectures = () => {
    const { user } = useSelector((state) => state.auth);
    const loaderData = useLoaderData();

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            margin={1}
            gap={1}
        >
            {user && (
                <Link to="create" component={RouterLink} underline="none">
                    <Button variant="outlined" fullWidth>
                        ADD LECTURE
                    </Button>
                </Link>
            )}
            <Box height="75vh">
                <DataGrid
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                    disableSelectionOnClick
                    experimentalFeatures={{ newEditingApi: true }}
                    rows={loaderData}
                    columns={columns}
                />
            </Box>
        </Box>
    );
};

export const loader = async () => {
    const { payload } = await LectureService.getAllLectures();
    const rows = getTableRows(payload);

    return rows;
};

export default Lectures;
