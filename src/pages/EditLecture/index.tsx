import dayjs from 'dayjs';
import { Navigate, useLoaderData, useNavigate } from 'react-router-dom';
import LectureService from '../../services/Lecture';
import type { LectureDetails } from '../../services/models';
import { useAppSelector } from '../../store';
import { LectureForm } from '../LectureForm';
import type { ExistingImage, LectureFormValues } from '../LectureForm/helpers';

export const EditLecture = () => {
    const lecture = useLoaderData() as LectureDetails;
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);

    const canManage =
        user?.role === 'admin' || String(lecture.author ?? '') === user?.id;

    // The server also rejects a non-owner, but sending them back to the list
    // beats showing a form that can never be saved.
    if (!canManage) {
        return <Navigate to="/lectures" replace />;
    }

    const parsedDate = lecture.date ? dayjs(lecture.date) : null;

    const initialValues: LectureFormValues = {
        topic: lecture.topic,
        teacher: (lecture.teacher ?? []).join(', '),
        lesson: (lecture.lesson ?? []).join(', '),
        date: parsedDate?.isValid() ? parsedDate.toDate() : undefined,
    };

    const initialImages: ExistingImage[] = (lecture.imageKeys ?? []).map(
        (key, index) => ({
            key,
            url: lecture.images[index] ?? '',
        })
    );

    const handleSubmit = (form: FormData) =>
        LectureService.updateLecture(lecture._id, form).then((response) => ({
            message: response.message,
            lectureId: response.payload._id,
        }));

    return (
        <LectureForm
            title={`Edit ${lecture.topic}`}
            submitLabel="Save changes"
            resetLabel="Reset"
            initialValues={initialValues}
            initialImages={initialImages}
            backTo="/lectures"
            onSubmit={handleSubmit}
            onSuccess={(lectureId) => navigate(`/lectures/${lectureId}`)}
        />
    );
};
