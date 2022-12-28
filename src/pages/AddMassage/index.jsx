import React, { useState } from 'react';
import update from 'immutability-helper';
import { Box, Button, Card, CardContent, Grid, Stack } from '@mui/material';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { getDraggableGrip, getTechnic, template } from './components/helpers';

import Header from '../../components/Header';
import TechnicItem from './components/TechnicItem';
import ListWithSearch from './components/ListWithSearch';
import TechnicControls from './components/TechnicControls';
import { useLoaderData } from 'react-router-dom';
import GripService from '../../services/Grip';
import MassageService from '../../services/Massage';
import Alert from '../../components/Alert';

function AddMassage() {
    const loaderData = useLoaderData();

    const [id, setId] = useState('');
    const [title, setTitle] = useState('');
    const [technics, setTechnics] = useState([]);
    const [alert, setAlert] = useState({ status: 'onhold' });

    const [listRef] = useAutoAnimate();

    const appendTechnic = (text) =>
        setTechnics((prev) => [...prev, getTechnic(text)]);

    const removeTechnic = (item) =>
        setTechnics((prev) => prev.filter((elem) => elem.id !== item.id));

    const setTemplate = () => setTechnics(template);

    const removeGrip = (techIndex, gripIndex) =>
        setTechnics(
            update(technics, {
                [techIndex]: {
                    grips: { $splice: [[gripIndex, 1]] },
                },
            })
        );

    const saveMassage = async () => {
        const parsedTechnics = technics.map((technic) => {
            const grips = technic.grips.map((grip) => grip._id);

            return {
                title: technic.title,
                grips: grips,
            };
        });

        try {
            const request = await MassageService.createMassage({
                title: title,
                technics: parsedTechnics,
            });

            setId(request.payload._id);
            setAlert({ status: 'successful', message: request.message });
        } catch (e) {
            setAlert({ status: 'error', message: e.message });
        }
    };

    return (
        <Box display="flex" flexDirection="column" gap={2} ref={listRef}>
            <Header />
            {alert.status !== 'onhold' && (
                <Alert
                    text={alert.message}
                    status={alert.status}
                    title={'Massage'}
                    onClose={() => setAlert({ status: 'onhold' })}
                    path={`/massages/${id}`}
                />
            )}
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <Card variant="outlined">
                        <CardContent>
                            <Box
                                gap={2}
                                display="flex"
                                overflow="auto"
                                flexDirection="column"
                                sx={{ maxHeight: '80vh' }}
                            >
                                <TechnicControls
                                    appendTechnic={appendTechnic}
                                    setTemplate={setTemplate}
                                    setTitle={(e) => setTitle(e.target.value)}
                                />
                                <Box ref={listRef}>
                                    {technics.map((technic, index) => (
                                        <TechnicItem
                                            key={technic.id}
                                            technic={technic}
                                            index={index}
                                            technics={technics}
                                            setTechnics={setTechnics}
                                            removeTechnic={removeTechnic}
                                            removeGrip={(gripIndex) =>
                                                removeGrip(index, gripIndex)
                                            }
                                        />
                                    ))}
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Box
                        gap={2}
                        display="flex"
                        flexDirection="column"
                        sx={{ maxHeight: '80vh' }}
                    >
                        {loaderData && (
                            <ListWithSearch
                                arr={loaderData.grips}
                                textKey={'text'}
                            />
                        )}
                        <Stack direction="column" spacing={1}>
                            <Button
                                fullWidth
                                variant="outlined"
                                color="success"
                                onClick={saveMassage}
                            >
                                Save
                            </Button>
                            <Button fullWidth variant="outlined" color="error">
                                Delete
                            </Button>
                        </Stack>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

export default AddMassage;

export const loader = async () => {
    const response = await GripService.getAllGrips();

    const grips = response.payload.map((item) => getDraggableGrip(item));

    return {
        grips: grips,
    };
};
