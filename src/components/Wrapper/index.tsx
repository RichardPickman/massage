import type { ReactNode } from 'react';
import Header from '../Header';

interface WrapperProps {
    children: ReactNode;
}

const Wrapper = ({ children }: WrapperProps) => {
    return (
        <div>
            <Header />
            {children}
        </div>
    );
};

export default Wrapper;
