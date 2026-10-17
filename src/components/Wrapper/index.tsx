import type { ReactNode } from 'react';
import Header from '../Header';
import { Card } from '../ui/card';

interface WrapperProps {
    children: ReactNode;
}

const Wrapper = ({ children }: WrapperProps) => {
    return (
        <Card>
            <Header />
            {children}
        </Card>
    );
};

export default Wrapper;
