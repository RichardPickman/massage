import dayjs from 'dayjs';

export const getForm = (topic, teacher, date, lesson, images) => {
    const lecture = new FormData();
    const currentDate = dayjs(date).format('MM/DD/YYYY');

    lecture.append('topic', topic);
    lecture.append('teacher', teacher);
    lecture.append('date', currentDate);
    lecture.append('lesson', lesson);

    for (let img of images) {
        lecture.append('images', img.file);
    }

    return lecture;
};
