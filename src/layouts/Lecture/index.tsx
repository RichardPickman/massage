import { Card } from '@/components/ui/card';
import { Outlet } from 'react-router-dom';
import Wrapper from '../../components/Wrapper';

export default function LecturesLayout() {
    return (
        <Wrapper>
            <Card>
                <Card>
                    <Outlet />
                </Card>
            </Card>
        </Wrapper>
    );
}
