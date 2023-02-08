import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { propsStyle } from './propsStyle';
import { Menu } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import { fetchLogout } from '../../store/reducers/auth/fetch';

export default function AccountMenu() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => dispatch(fetchLogout());

    const handleAdminPanel = () => navigate('/admin', { replace: true });

    return (
        <React.Fragment>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    textAlign: 'center',
                }}
            >
                <IconButton
                    onClick={handleClick}
                    size="small"
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <Avatar>{user.nickname}</Avatar>
                </IconButton>
            </Box>
            <Menu
                id="account-menu"
                anchorEl={anchorEl}
                PaperProps={propsStyle}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem>
                    <Avatar /> My account
                </MenuItem>
                <Divider />
                {user.role === 'admin' && (
                    <MenuItem onClick={handleAdminPanel}>
                        <ListItemIcon>
                            <AdminPanelSettingsOutlinedIcon fontSize="small" />
                        </ListItemIcon>
                        Admin panel
                    </MenuItem>
                )}
                <MenuItem>
                    <ListItemIcon>
                        <Settings fontSize="small" />
                    </ListItemIcon>
                    Settings
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </React.Fragment>
    );
}
