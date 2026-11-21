import { useTranslation } from 'react-i18next';

import LectureService from '../../services/Lecture';
import { LectureForm } from '../LectureForm';
import type { LectureFormValues } from '../LectureForm/helpers';

const initialValues: LectureFormValues = {
    topic: '',
    teacher: '',
    lesson: '',
};

const handleSubmit = (form: FormData) =>
    LectureService.createLecture(form).then((response) => ({
        message: response.message,
        lectureId: response.payload._id,
    }));

export const AddLecture = () => {
    const { t } = useTranslation();

    return (
        <LectureForm
            title={t('lectures.add')}
            submitLabel={t('common.save')}
            resetLabel={t('common.clear')}
            initialValues={initialValues}
            onSubmit={handleSubmit}
        />
    );
};
