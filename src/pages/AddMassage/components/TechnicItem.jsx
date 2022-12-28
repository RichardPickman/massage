import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Box, IconButton } from '@mui/material';
import { DropTarget } from './DropTarget';
import Accordion from '../../../components/Accordion';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import update from 'immutability-helper';

function TechnicItem({
    technics,
    setTechnics,
    technic,
    index,
    removeTechnic,
    removeGrip,
}) {
    const handleDrop = useCallback(
        (index, item) => {
            const hasItem = technic.grips.includes(item);

            setTechnics(
                update(technics, {
                    [index]: {
                        grips: !hasItem ? { $push: [item] } : { $push: [] },
                    },
                })
            );
        },
        [technics]
    );

    const moveTechnic = useCallback(
        (dragIndex, hoverIndex) => {
            setTechnics((prevTech) =>
                update(prevTech, {
                    $splice: [
                        [dragIndex, 1],
                        [hoverIndex, 0, prevTech[dragIndex]],
                    ],
                })
            );
        },
        [technics]
    );

    return (
        <Box display="flex" gap={2}>
            <DropTarget
                accept={technic.acceptsChildren}
                onDrop={(dragged) => handleDrop(index, dragged)}
            >
                <Accordion
                    technic={technic}
                    moveTechnic={moveTechnic}
                    isConstructor={true}
                    index={index}
                    removeGrip={removeGrip}
                />
            </DropTarget>
            <Box>
                <IconButton
                    color="error"
                    onClick={() => removeTechnic(technic)}
                >
                    <DeleteOutlineIcon />
                </IconButton>
            </Box>
        </Box>
    );
}

TechnicItem.propTypes = {
    index: PropTypes.number,
    technic: PropTypes.object,
    technics: PropTypes.array,
    handleDrop: PropTypes.func,
    setTechnics: PropTypes.func,
    moveTechnic: PropTypes.func,
    removeTechnic: PropTypes.func,
    removeGrip: PropTypes.func,
};

export default TechnicItem;
