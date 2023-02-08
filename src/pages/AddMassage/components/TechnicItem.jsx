import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Box, IconButton } from '@mui/material';
import { DropTarget } from './DropTarget';
import Accordion from '../../../components/Accordion';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useDispatch } from 'react-redux';
import { addGrip, removeTechnic } from '../../../store/reducers/massage';

function TechnicItem({ technic, technicIndex }) {
    const dispatch = useDispatch();

    const handleDrop = (item) => {
        dispatch(addGrip({ technicIndex, item }));
    };

    const handleRemove = () => {
        dispatch(removeTechnic({ technicId: technic.id }));
    };

    return (
        <Box display="flex" gap={2}>
            <DropTarget accept={technic.acceptsChildren} onDrop={handleDrop}>
                <Accordion
                    technic={technic}
                    isConstructor={true}
                    technicIndex={technicIndex}
                />
            </DropTarget>
            <Box>
                <IconButton color="error" onClick={handleRemove}>
                    <DeleteOutlineIcon />
                </IconButton>
            </Box>
        </Box>
    );
}

TechnicItem.propTypes = {
    technicIndex: PropTypes.number,
    technic: PropTypes.object,
};

export default memo(TechnicItem);
