import { Checkbox } from '@/components/ui/checkbox';
import { useContext } from 'react';
import { ThemeContext } from '../ThemeProvider';

const Theme = () => {
    const toggleTheme = useContext(ThemeContext);

    const handleSwitch = () => toggleTheme.toggleColorMode();

    return (
        <Checkbox checked={toggleTheme.darkEnabled} onChange={handleSwitch} />
    );
};

export default Theme;
