import { Card } from '@/components/ui/card';
import { useLoaderData } from 'react-router-dom';
import CustomLink from '../../../components/Link';
import LessonService from '../../../services/Lesson';
import PageHeader from '../helpers/PageHeader';
import { columns } from './tableData';

function Lessons() {
    const loaderData = useLoaderData();

    return (
        <Card>
            <PageHeader title={'LESSONS'} description={'Manage lessons'} />
            <CustomLink to={'add'}>
                <Button fullWidth variant="outlined">
                    Add lesson
                </Button>
            </CustomLink>
            <DataGrid
                rows={loaderData}
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
    try {
        const response = await LessonService.getAllLessons();

        return response;
    } catch (error) {
        return error;
    }
};

export default Lessons;
