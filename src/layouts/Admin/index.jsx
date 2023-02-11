import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import MuiDrawer from '@mui/material/Drawer';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import { Outlet, Link as RouterLink } from 'react-router-dom';
import { links } from './links';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { CssBaseline, Divider, IconButton, Link } from '@mui/material';
import styled from '@emotion/styled';
import AdminInfo from './components/AdminInfo';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import ThemeSmall from '../../components/ThemeSmall';
import AnimatedList from '../../components/AnimatedList';

export const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
    }),
}));

function Sidebar() {
    const [open, setOpen] = React.useState(true);

    const handleDrawerToggle = () => setOpen(!open);

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AnimatedList>
                <Drawer variant="permanent" open={open}>
                    <Box display="flex" p={2} justifyContent="right">
                        <IconButton onClick={handleDrawerToggle}>
                            {open ? <ChevronLeftIcon /> : <MenuIcon />}
                        </IconButton>
                    </Box>
                    <Divider />
                    {open && (
                        <>
                            <AdminInfo />
                            <Divider />
                        </>
                    )}
                    <List>
                        {links.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                color="inherit"
                                underline="none"
                                component={RouterLink}
                            >
                                <ListItem disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon>{link.icon}</ListItemIcon>
                                        <ListItemText primary={link.header} />
                                    </ListItemButton>
                                </ListItem>
                            </Link>
                        ))}
                    </List>
                </Drawer>
            </AnimatedList>
            <Box display="flex" flexDirection="column" margin={2} width="100%">
                <Box display="flex" justifyContent="right" gap={1}>
                    <ThemeSmall />
                    <Link
                        to={'/'}
                        color="inherit"
                        underline="none"
                        component={RouterLink}
                    >
                        <IconButton>
                            <ExitToAppOutlinedIcon />
                        </IconButton>
                    </Link>
                </Box>
                <Outlet />
            </Box>
        </Box>
    );
}

export default Sidebar;
