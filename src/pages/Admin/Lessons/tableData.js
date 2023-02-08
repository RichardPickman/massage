export const columns = [
    { field: 'id', headerName: 'ID' },
    { field: 'title', headerName: 'Title', flex: 1, align: 'left' },
    {
        field: 'teacher',
        headerName: 'Teacher',
        headerAlign: 'center',
        flex: 1,
        align: 'center',
        renderCell: ({ row: { teacher } }) => {
            return [teacher.firstName, teacher.lastName].join(' ');
        },
    },
    {
        field: 'room',
        headerName: 'Room',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
    },
    {
        field: 'time',
        headerName: 'Time',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
    },
    {
        field: 'days',
        headerName: 'Days',
        flex: 2,
        headerAlign: 'center',
        align: 'center',
        renderCell: ({ row: { days } }) => {
            return days.join(', ');
        },
    },
];
