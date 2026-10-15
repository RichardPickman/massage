import { useSelector } from 'react-redux';
import { Link as RouterLink, useLoaderData } from 'react-router-dom';
import MassageService from '../../services/Massage';

function Massages() {
    const { isAuth } = useSelector((state) => state.auth);
    const loaderData = useLoaderData();

    return (
        <Card flex justifyContent="center" alignItems="center">
            <Card justifyContent="space-between" width="40%">
                <p variant="h4">Massages</p>
                {isAuth && (
                    <Link underline="none" to={'create'} component={RouterLink}>
                        <Button variant="outlined">Add massage</Button>
                    </Link>
                )}
            </Card>
            {loaderData.length === 0 && <p>There is no any massages yet...</p>}
            <Stack>
                {loaderData.map((massage, index) => (
                    <Link
                        underline="none"
                        key={index}
                        to={`/massages/${massage._id}`}
                        component={RouterLink}
                    >
                        <Button>{massage.title}</Button>
                    </Link>
                ))}
            </Stack>
        </Card>
    );
}

export const loader = async () => {
    const { payload } = await MassageService.getAllMassages();

    return payload;
};

export default Massages;
