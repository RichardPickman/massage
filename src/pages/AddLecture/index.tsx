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

export const AddLecture = () => (
    <LectureForm
        title="Add lecture"
        submitLabel="Save"
        initialValues={initialValues}
        onSubmit={handleSubmit}
    />
);
