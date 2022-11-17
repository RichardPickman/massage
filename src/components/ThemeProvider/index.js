import React, { useMemo, useState } from 'react';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import PropTypes from 'prop-types';

export const ThemeContext = React.createContext({
    toggleColorMode: () => {},
    mode: 'light',
});

const ThemeProviderHook = ({ children }) => {
    const [darkEnabled, setDarkEnabled] = useState(false);
    const colorMode = useMemo(
        () => ({
            toggleColorMode: () =>
                setDarkEnabled((prevMode) => (prevMode ? false : true)),
            darkEnabled,
        }),
        [darkEnabled]
    );

    const dark = createTheme({ palette: { mode: 'dark' } });
    const light = createTheme({ palette: { mode: 'light' } });

    const mode = darkEnabled ? dark : light;

    return (
        <ThemeContext.Provider value={colorMode}>
            <ThemeProvider theme={mode}>
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
