import { useLayoutEffect } from 'react';
import { useLoaderData, type LoaderFunctionArgs } from 'react-router-dom';
import LectureService from '../../services/Lecture';
import { useAppDispatch } from '../../store';
import { setImages } from '../../store/reducers/images';
import { ImageSlider } from './ImageSlider';

interface LectureLoaderData {
    images: string[];
}

export const Lecture = () => {
    const loaderData = useLoaderData() as LectureLoaderData;
    const dispatch = useAppDispatch();

    useLayoutEffect(() => {
        dispatch(setImages(loaderData.images));
    }, [dispatch, loaderData.images]);

    return <ImageSlider />;
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const lectureId = params.id;

    if (!lectureId) {
        throw new Error('Lecture id is missing');
    }

    const { payload } = await LectureService.getLecture(lectureId);

    return payload;
};

