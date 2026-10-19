import { Outlet } from 'react-router-dom';

import Wrapper from '../components/Wrapper';

const Layout = () => {
    return (
        <Wrapper>
            <Outlet />
        </Wrapper>
    );
};

export default Layout;
