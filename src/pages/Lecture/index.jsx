import React, { useState } from 'react';
import { useLayoutEffect, useContext } from 'react';
import { LayoutContext } from '../../context/layout';
import ImageSlider from './ImageSlider';
import { Box } from '@mui/system';
import { useLoaderData } from 'react-router-dom';
import { ImagesContext } from '../../context/images';
import LectureService from '../../services/Lecture';

const Lecture = () => {
    const loaderData = useLoaderData();
    const [headerState, dispatchHeader] = useContext(LayoutContext);
    const [lectureState, dispatchLecture] = useContext(ImagesContext);

    useLayoutEffect(() => {
        dispatchLecture({
            type: 'set_images',
            payload: loaderData.images,
        });

        dispatchHeader({ type: 'HIDE' });
    }, []);

    const { innerHeight } = window;

    return (
        <Box height={innerHeight} sx={{ background: 'rgba(0,0,0, 0.4)' }}>
            <ImageSlider />
        </Box>
    );
};

export const loader = async ({ params }) => {
    const lectureId = params.id;

    const { payload } = await LectureService.getLecture(lectureId);

    return payload;
};

export default Lecture;
