import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Box, IconButton, Typography } from '@mui/material';
import { DropTarget } from './DropTarget';
import Accordion from '../../../components/Accordion';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useDispatch } from 'react-redux';
import {
    addGrip,
    moveTechnic,
    removeGrip,
    removeTechnic,
} from '../../../store/reducers/massage';
import ClearIcon from '@mui/icons-material/Clear';
import SortableTechnicItem from './SortableTechnics';
import {
    StyledAccordionDetails,
    StyledAccordionSummary,
} from '../../../components/Accordion/styles';
import AnimatedList from '../../../components/AnimatedList';
import { Item } from './helpers';

function TechnicItem({ technic, technicIndex }) {
    const dispatch = useDispatch();

    const handleDrop = (item) => {
        dispatch(addGrip({ technicIndex, item }));
    };

    const handleRemove = () => {
        dispatch(removeTechnic({ technicId: technic.id }));
    };

    const handleTechnic = (dragIndex, hoverIndex) => {
        dispatch(moveTechnic({ dragIndex, hoverIndex }));
    };

    const handleGripRemove = (e) => {
        dispatch(
            removeGrip({
                technicIndex,
                gripId: e.target.value,
            })
        );
    };

    return (
        <Box display="flex" gap={2}>
            <DropTarget accept={technic.acceptsChildren} onDrop={handleDrop}>
                <Accordion
                    technic={technic}
                    isConstructor={true}
                    technicIndex={technicIndex}
                >
                    <SortableTechnicItem
                        technic={technic}
                        index={technicIndex}
                        accept={technic.acceptsSelf}
                        moveTechnic={handleTechnic}
                    >
                        <StyledAccordionSummary>
                            <Typography textTransform={'capitalize'}>
                                {technic.title}
                            </Typography>
                        </StyledAccordionSummary>
                    </SortableTechnicItem>
                    <StyledAccordionDetails>
                        <AnimatedList
                            display="flex"
                            flexDirection="column"
                            gap={1}
                        >
                            {technic.grips.map((item) => (
                                <Item key={item._id} elevation={2}>
                                    <Typography noWrap>{item.title}</Typography>
                                    <IconButton
                                        size="small"
                                        value={item._id}
                                        onClick={handleGripRemove}
                                    >
                                        <ClearIcon
                                            sx={{
                                                pointerEvents: 'none',
                                                fontSize: 18,
                                            }}
                                        />
                                    </IconButton>
                                </Item>
                            ))}
                        </AnimatedList>
                    </StyledAccordionDetails>
                </Accordion>
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
