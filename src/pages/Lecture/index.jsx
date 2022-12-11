import React from 'react';
import { useLayoutEffect } from 'react';
import ImageSlider from './ImageSlider';
import { Box } from '@mui/system';
import { useLoaderData } from 'react-router-dom';
import LectureService from '../../services/Lecture';
import { useDispatch } from 'react-redux';
import { setImages } from '../../store/reducers/images';

const Lecture = () => {
    const loaderData = useLoaderData();
    const dispatch = useDispatch();

    useLayoutEffect(() => {
        dispatch(setImages(loaderData.images));
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
