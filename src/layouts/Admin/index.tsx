import { Card } from '@/components/ui/card';
import { Outlet, Link as RouterLink } from 'react-router-dom';
import AnimatedList from '../../components/AnimatedList';
import ThemeSmall from '../../components/ThemeSmall';
import AdminInfo from './components/AdminInfo';
import { links } from './links';

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

function Sidebar() {
    const [open, setOpen] = useState(true);

    const handleDrawerToggle = () => setOpen(!open);

    return (
        <Card>
            <CssBaseline />
            <AnimatedList>
                <Drawer variant="permanent" open={open}>
                    <Card p={2} justifyContent="right">
                        <IconButton onClick={handleDrawerToggle}>
                            {open ? <ChevronLeftIcon /> : <MenuIcon />}
                        </IconButton>
                    </Card>
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
            <Card flex margin={2} width="100%">
                <Card justifyContent="right">
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
                </Card>
                <Outlet />
            </Card>
        </Card>
    );
}

export default Sidebar;
