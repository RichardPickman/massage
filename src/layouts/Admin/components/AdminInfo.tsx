import { Card } from '@/components/ui/card';
import { useSelector } from 'react-redux';
import { fetchStatuses } from '../../../utils/consts';

function AdminInfo() {
    const auth = useSelector((state) => state.auth);

    if (auth.status !== fetchStatuses.SUCCEEDED) {
        return <div>Loading...</div>;
    }

    if (auth.status === fetchStatuses.SUCCEEDED) {
        return (
            <Card>
                <Card>
                    <Card
                        component="img"
                        src="https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Fi.ytimg.com%2Fvi%2FGl0yOmn25hg%2Fmaxresdefault.jpg&sp=1675116964T2931bd93e25864742abe0a4da545fddaf4f5e025dfd059af699a6cafd10545b4"
                        sx={{
                            borderRadius: '50%',
                            objectFit: 'cover',
                            height: 100,
                            width: 100,
                        }}
                    />
                </Card>
                <Stack alignItems="center">
                    <p variant="h6" sx={{ flexGrow: 1 }}>
                        {auth.user.email}
                    </p>
                    <p variant="body2" sx={{ flexGrow: 1 }}>
                        {auth.user.email}
                    </p>
                    <p variant="body2" sx={{ flexGrow: 1 }} color="#71aaeb">
                        {auth.user.role}
                    </p>
                </Stack>
            </Card>
        );
    }
}

export default AdminInfo;
