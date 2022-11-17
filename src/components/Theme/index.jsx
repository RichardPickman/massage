import React from 'react';
import { useContext } from 'react';
import { ThemeContext } from '../ThemeProvider';
import { ThemeSwitch } from './helpers';

const Theme = () => {
    const toggleTheme = useContext(ThemeContext);

    const handleSwitch = () => toggleTheme.toggleColorMode();

    return (
        <ThemeSwitch
            checked={toggleTheme.darkEnabled}
            onChange={handleSwitch}
        />
    );
};

export default Theme;
