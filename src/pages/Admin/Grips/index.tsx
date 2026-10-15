import { Card } from '@/components/ui/card';
import React, { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { drawerWidth } from '../../../layouts/Admin';
import {
    fetchAllGrips,
    fetchCreate,
    fetchRemove,
} from '../../../store/reducers/grips/fetch';
import PageHeader from '../helpers/PageHeader';
import ListWithSearch from './components/ListWithSearch';

function Grips() {
    const { grips } = useSelector((state) => state.grip);
    const dispatch = useDispatch();

    const [grip, setGrip] = useState('');

    const contentWidth = window.innerWidth - drawerWidth;

    const handleGripChange = (e) => setGrip(e.target.value);
    const handleGripSubmit = () => {
        dispatch(fetchCreate({ title: grip }));
        setGrip('');
    };
    const handleGripRemove = (id) => dispatch(fetchRemove(id));

    useLayoutEffect(() => {
        dispatch(fetchAllGrips());
    }, []);

    return (
        <Card>
            <PageHeader title={'GRIPS'} description={'Manage grips'} />
            <Card
                sx={{ width: contentWidth <= 768 ? '100%' : '50%' }}
                margin={contentWidth <= 768 ? 0 : '0 auto'}
                maxHeight="calc(100vh - 11rem)"
                overflow="auto"
            >
                <ListWithSearch
                    arr={grips}
                    textKey={'title'}
                    onDelete={handleGripRemove}
                />
                <Paper
                    variant="outlined"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        p: 2,
                        height: '100%',
                    }}
                >
                    <TextField
                        label="Grip"
                        value={grip}
                        onChange={handleGripChange}
                    />
                    <Button variant="outlined" onClick={handleGripSubmit}>
                        Add grip
                    </Button>
                </Paper>
            </Card>
        </Card>
    );
}

export default Grips;
