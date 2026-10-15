import { Card } from '@/components/ui/card';

function PageHeader({ title, description }) {
    return (
        <Card>
            <p variant="h3">{title}</p>
            <p color="#71aaeb">{description}</p>
        </Card>
    );
}

export default PageHeader;
