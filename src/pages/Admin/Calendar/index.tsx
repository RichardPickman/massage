import { formatDate } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';

import { Card } from '@/components/ui/card';
import { useLoaderData } from 'react-router-dom';
import { drawerWidth } from '../../../layouts/Admin';
import LessonService from '../../../services/Lesson';
import { getEvents } from './helpers';

function Calendar() {
    const loaderData = useLoaderData();
    const [currentEvents, setCurrentEvents] = useState([]);
    const contentWidth = window.innerWidth - drawerWidth;

    const handleDateClick = (selected) => {
        const title = prompt('Event Title:');
        const calendarApi = selected.view.calendar;
        calendarApi.unselect();

        if (title) {
            calendarApi.addEvent({
                id: `${selected.dateStr}-${title}`,
                title,
                start: selected.startStr,
                end: selected.endStr,
                allDay: selected.allDay,
            });
        }
    };

    const handleEventClick = (selected) => {
        if (
            window.confirm(
                `Are you sure you want to delete this event ${selected.event.title}?`
            )
        ) {
            selected.event.remove();
        }
    };

    return (
        <Card>
            <Card justifyContent="space-between">
                {contentWidth > 768 && (
                    <Card flex="1 1 20%">
                        <p variant="h5">Events</p>
                        <List>
                            {currentEvents.map((event) => (
                                <ListItem key={event.id}>
                                    <ListItemText
                                        primary={event.title}
                                        secondary={
                                            <p>
                                                {formatDate(event.start, {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Card>
                )}
                <Card flex="1 1 100%" ml="15px">
                    <FullCalendar
                        height="75vh"
                        plugins={[
                            dayGridPlugin,
                            timeGridPlugin,
                            interactionPlugin,
                            listPlugin,
                        ]}
                        firstDay={1}
                        headerToolbar={{
                            left: 'prev,today,next',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
                        }}
                        initialView="dayGridMonth"
                        selectable={true}
                        selectMirror={true}
                        eventTimeFormat={{
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                        }}
                        editable={true}
                        dayMaxEvents={true}
                        events={loaderData.events}
                        select={handleDateClick}
                        eventClick={handleEventClick}
                        eventsSet={(events) => setCurrentEvents(events)}
                    />
                </Card>
            </Card>
        </Card>
    );
}

export const loader = async () => {
    try {
        const response = await LessonService.getAllLessons();
        const events = getEvents(response);

        return {
            response,
            events,
        };
    } catch (error) {
        return error;
    }
};

export default Calendar;
