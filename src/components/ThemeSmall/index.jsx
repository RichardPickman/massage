import { IconButton } from '@mui/material';
import React, { useContext } from 'react';
import { ThemeContext } from '../ThemeProvider';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';

function ThemeSmall() {
    const toggleTheme = useContext(ThemeContext);

    const handleSwitch = () => toggleTheme.toggleColorMode();

    return (
        <IconButton onClick={handleSwitch}>
            {toggleTheme.darkEnabled ? (
                <LightModeOutlinedIcon />
            ) : (
                <DarkModeOutlinedIcon />
            )}
        </IconButton>
    );
}

export default ThemeSmall;
