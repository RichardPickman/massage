import { Outlet } from 'react-router-dom';

import { Card } from '@/components/ui/card';
import Wrapper from '../components/Wrapper';

const Layout = () => {
    return (
        <Wrapper>
            <div className="flex">
                <Card>
                    <Outlet />
                </Card>
            </div>
        </Wrapper>
    );
};

export default Layout;
