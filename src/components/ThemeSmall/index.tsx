import React, { useContext } from 'react';
import { ThemeContext } from '../ThemeProvider';

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
