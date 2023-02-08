const dayNumber = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
};

export const getEvents = (lessons) => {
    const result = [];

    for (let lesson of lessons) {
        const time = lesson.time.split('-');
        const daysNumbers = lesson.days.map((day) => dayNumber[day]);

        result.push({
            title: lesson.title,
            daysOfWeek: daysNumbers,
            startTime: `${time[0]}:00`,
            endTime: `${time[1]}:00`,
        });
    }

    return result;
};
