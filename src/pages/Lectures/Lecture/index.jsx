import React, { useState } from 'react';
import { useLayoutEffect, useContext } from 'react';
import { LayoutContext } from '../../../context/layout';
import ImageSlider from './ImageSlider';
import { Box } from '@mui/system';
import { useParams } from 'react-router-dom';
import { getLecture } from '../../../http/lectures';
import { ImagesContext } from '../../../context/images';

const Lecture = () => {
    const [headerState, dispatchHeader] = useContext(LayoutContext);
    const [lectureState, dispatchLecture] = useContext(ImagesContext);
    const [lecture, setLecture] = useState({});
    const { id } = useParams();

    useLayoutEffect(() => {
        const fetchQuiz = async () => {
            try {
                const { data } = await getLecture(id);

                setLecture(data.payload);

                dispatchLecture({
                    type: 'set_images',
                    payload: data.payload.images,
                });
            } catch (e) {
                console.log(e.message);
            }
        };

        fetchQuiz();
    }, []);

    useLayoutEffect(() => dispatchHeader({ type: 'HIDE' }), []);

    const { innerHeight } = window;

    return (
        <Box height={innerHeight} sx={{ background: 'rgba(0,0,0, 0.4)' }}>
            <ImageSlider />
        </Box>
    );
};

export default Lecture;
