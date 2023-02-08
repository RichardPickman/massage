import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import React from 'react';
import FullCalendar from '@fullcalendar/react';
import { formatDate } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { drawerWidth } from '../../../layouts/Admin';
import LessonService from '../../../services/Lesson';
import { getEvents } from './helpers';
import { useLoaderData } from 'react-router-dom';

function Calendar() {
    const loaderData = useLoaderData();
    const [currentEvents, setCurrentEvents] = React.useState([]);
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
        <Box m="20px">
            <Box display="flex" justifyContent="space-between">
                {contentWidth > 768 && (
                    <Box flex="1 1 20%">
                        <Typography variant="h5">Events</Typography>
                        <List>
                            {currentEvents.map((event) => (
                                <ListItem key={event.id}>
                                    <ListItemText
                                        primary={event.title}
                                        secondary={
                                            <Typography>
                                                {formatDate(event.start, {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}
                <Box flex="1 1 100%" ml="15px">
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
                </Box>
            </Box>
        </Box>
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
