import { Outlet } from 'react-router-dom';

import { Card } from '@/components/ui/card';
import Wrapper from '../../components/Wrapper';

function Layout() {
    const { innerWidth } = window;

    if (innerWidth >= 1680) {
        return (
            <Wrapper>
                <div className="flex">
                    <Card>
                        <Outlet />
                    </Card>
                </div>
            </Wrapper>
        );
    }

    if (innerWidth <= 1680 && innerWidth >= 768) {
        return (
            <Wrapper>
                <div className="flex">
                    <Card>
                        <Outlet />
                    </Card>
                </div>
            </Wrapper>
        );
    }

    if (innerWidth <= 768 && innerWidth >= 360) {
        return (
            <Wrapper>
                <div className="flex">
                    <Card>
                        <Outlet />
                    </Card>
                </div>
            </Wrapper>
        );
    }
}

export default Layout;
