import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Link } from '@mui/material';
import { Link as RouterLink, useLoaderData } from 'react-router-dom';
import { useLayoutEffect } from 'react';
import { getTableRows, columns } from './helpers';
import LectureService from '../../services/Lecture';

const Lectures = () => {
    const loaderData = useLoaderData();
    const [lectures, setLectures] = useState([]);

    useLayoutEffect(() => {
        const rows = getTableRows(loaderData);

        setLectures(rows);
    }, []);

    return (
        <Box display="flex" flexDirection="column" justifyContent="center">
            <Link to="create" component={RouterLink} underline="none">
                <Button variant="outlined" sx={{ margin: 1, width: '100%' }}>
                    ADD LECTURE
                </Button>
            </Link>
            <Box height="75vh" width="100%" margin={1}>
                <DataGrid rows={[...lectures]} columns={columns} />
            </Box>
        </Box>
    );
};

export const loader = async () => {
    const { payload } = await LectureService.getAllLectures();

    return payload;
};

export default Lectures;
