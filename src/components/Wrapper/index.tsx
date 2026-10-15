import Header from '../Header';
import { Card } from '../ui/card';

function Wrapper({ children }) {
    return (
        <Card>
            <Header />
            {children}
        </Card>
    );
}

export default Wrapper;
