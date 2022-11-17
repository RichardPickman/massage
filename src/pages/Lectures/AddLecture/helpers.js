import moment from 'moment';

export const getForm = (topic, teacher, date, lesson, images) => {
    const lecture = new FormData();
    const currentDate = moment(date).format('MM/DD/YYYY');

    lecture.append('topic', topic);
    lecture.append('teacher', teacher);
    lecture.append('date', currentDate);
    lecture.append('lesson', lesson);

    for (let img of images) {
        lecture.append('images', img);
    }

    return lecture;
};

export const handleImages = (files, images) => {
    const imgs = [...images];

    for (let image of files) {
        imgs.push(image);
    }

    return imgs;
};
