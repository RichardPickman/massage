import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useLayoutEffect } from 'react';
import { getTableRows, columns } from './helpers';
import LectureService from '../../services/Lecture';

const Lectures = () => {
    const [lectures, setLectures] = useState([]);

    useLayoutEffect(() => {
        const fetchLectures = async () => {
            try {
                const { payload } = await LectureService.getAllLectures();
                const preparedData = getTableRows(payload);

                setLectures(preparedData);
            } catch (e) {
                console.log(e.message);
            }
        };

        fetchLectures();
    }, []);

    return (
        <Box display="flex" flexDirection="column" justifyContent="center">
            <Link to="create" component={RouterLink} underline="none">
                <Button variant="contained" sx={{ margin: 1, width: '100%' }}>
                    ADD LECTURE
                </Button>
            </Link>
            <Box height="75vh" width="100%" margin={1}>
                <DataGrid rows={[...lectures]} columns={columns} />
            </Box>
        </Box>
    );
};

export default Lectures;
