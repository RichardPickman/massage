import { useLoaderData } from 'react-router-dom';
import UserService from '../../../services/User';
import PageHeader from '../helpers/PageHeader';
import { columns } from './tableData';

function Users() {
    const loadData = useLoaderData();

    return (
        <Card
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            height="calc(100vh - 5rem)"
        >
            <PageHeader title={'USERS'} description={'Manage users'} />
            <DataGrid
                rows={loadData}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
                disableSelectionOnClick
                experimentalFeatures={{ newEditingApi: true }}
            />
        </Card>
    );
}

export const loader = async () => {
    const payload = await UserService.getAll();

    if (!payload) {
        throw { message: 'Something went wrong' };
    }

    return payload;
};

export default Users;
