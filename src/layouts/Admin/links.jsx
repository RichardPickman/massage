import React from 'react';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SupervisedUserCircleOutlinedIcon from '@mui/icons-material/SupervisedUserCircleOutlined';
import PanToolOutlinedIcon from '@mui/icons-material/PanToolOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';

export const links = [
    {
        to: 'users',
        header: 'Users',
        icon: <PersonOutlineOutlinedIcon />,
    },
    {
        to: 'teachers',
        header: 'Teachers',
        icon: <SupervisedUserCircleOutlinedIcon />,
    },
    {
        to: 'grips',
        header: 'Grips',
        icon: <PanToolOutlinedIcon />,
    },
    {
        to: 'lessons',
        header: 'Lessons',
        icon: <SchoolOutlinedIcon />,
    },
    {
        to: 'calendar',
        header: 'Calendar',
        icon: <CalendarMonthOutlinedIcon />,
    },
];
