import React, { memo } from 'react';
import { useDispatch } from 'react-redux';
import Accordion from '../../../components/Accordion';
import {
    StyledAccordionDetails,
    StyledAccordionSummary,
} from '../../../components/Accordion/styles';
import AnimatedList from '../../../components/AnimatedList';
import { Card } from '../../../components/ui/card';
import {
    addGrip,
    moveTechnic,
    removeGrip,
    removeTechnic,
} from '../../../store/reducers/massage';
import { DropTarget } from './DropTarget';
import { Item } from './helpers';
import SortableTechnicItem from './SortableTechnics';

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
        <Card>
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
                            <p textTransform={'capitalize'}>{technic.title}</p>
                        </StyledAccordionSummary>
                    </SortableTechnicItem>
                    <StyledAccordionDetails>
                        <AnimatedList flex>
                            {technic.grips.map((item) => (
                                <Item key={item._id} elevation={2}>
                                    <p>{item.title}</p>
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
            <Card>
                <IconButton color="error" onClick={handleRemove}>
                    <DeleteOutlineIcon />
                </IconButton>
            </Card>
        </Card>
    );
}

export default memo(TechnicItem);
