import React, {
    createContext,
    useLayoutEffect,
    useMemo,
    useState,
} from 'react';
import { useLocalStorage } from '../../hooks/localStorage';

export const ThemeContext = createContext({
    toggleColorMode: () => {},
    mode: 'light',
});

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
