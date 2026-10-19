import { Card } from '@/components/ui/card';
import { Outlet } from 'react-router-dom';
import Wrapper from '../../components/Wrapper';

function QuizLayout() {
    const contentWidth = window.innerWidth;

    return (
        <Wrapper>
            <Card>
                <Card className={contentWidth >= 768 ? 'w-[70%]' : 'w-full'}>
                    <Outlet />
                </Card>
            </Card>
        </Wrapper>
    );
}

export default QuizLayout;
