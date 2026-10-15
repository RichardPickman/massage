import { Link as RouterLink } from 'react-router-dom';
import { Button } from '../ui/button';

function CustomLink({ to }: { to: string }) {
    return (
        <RouterLink to={to}>
            <Button variant="link"></Button>
        </RouterLink>
    );
}

export default CustomLink;
