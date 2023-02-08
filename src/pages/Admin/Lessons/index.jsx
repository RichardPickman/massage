import { Box, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React from 'react';
import { useLoaderData } from 'react-router-dom';
import CustomLink from '../../../components/Link';
import LessonService from '../../../services/Lesson';
import PageHeader from '../helpers/PageHeader';
import { columns } from './tableData';

function Lessons() {
    const loaderData = useLoaderData();

    return (
        <Box
            display="flex"
            flexDirection="column"
            gap={1}
            height="calc(100vh - 5rem)"
        >
            <PageHeader title={'LESSONS'} description={'Manage lessons'} />
            <CustomLink to={'add'}>
                <Button fullWidth variant="outlined">
                    Add lesson
                </Button>
            </CustomLink>
            <DataGrid
                rows={loaderData}
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
    try {
        const response = await LessonService.getAllLessons();

        return response;
    } catch (error) {
        return error;
    }
};

export default Lessons;
