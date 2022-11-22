import React, { useLayoutEffect, useMemo, useState } from 'react';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import PropTypes from 'prop-types';
import useLocalStorage from '../../hooks/localStorage';

export const ThemeContext = React.createContext({
    toggleColorMode: () => {},
    mode: 'light',
});

const dark = createTheme({ palette: { mode: 'dark' } });
const light = createTheme({ palette: { mode: 'light' } });

const ThemeProviderHook = ({ children }) => {
    const [theme, setTheme] = useLocalStorage('theme', false);
    const [darkEnabled, setDarkEnabled] = useState(theme);
    const colorMode = useMemo(
        () => ({
            toggleColorMode: () =>
                setDarkEnabled((prevMode) => (prevMode ? false : true)),
            darkEnabled,
        }),
        [darkEnabled]
    );

    useLayoutEffect(() => setTheme(darkEnabled), [darkEnabled]);

    return (
        <ThemeContext.Provider value={colorMode}>
            <ThemeProvider theme={darkEnabled ? dark : light}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};

export default ThemeProviderHook;

ThemeProviderHook.propTypes = {
    children: PropTypes.node,
};
