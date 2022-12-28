import React, { useState } from 'react';
import { ExpandMoreOutlined } from '@mui/icons-material';
import {
    StyledAccordion,
    StyledAccordionDetails,
    StyledAccordionSummary,
} from './styles';
import { IconButton, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { Box } from '@mui/system';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Item } from '../../pages/AddMassage/components/helpers';

import ClearIcon from '@mui/icons-material/Clear';
import SortableTechnicItem from '../../pages/AddMassage/components/SortableTechnics';

function Accordion({ isConstructor, removeGrip, technic, index, moveTechnic }) {
    const [expanded, setExpanded] = useState(true);
    const [listRef] = useAutoAnimate();
    const isGripsNotEmpty = technic.grips.length > 0;

    const handleExpand = (e, isExpanded) =>
        isGripsNotEmpty && setExpanded(isExpanded);

    const Summary = () => (
        <StyledAccordionSummary
            expandIcon={isGripsNotEmpty ? <ExpandMoreOutlined /> : false}
        >
            <Typography textTransform={'capitalize'}>
                {technic.title}
            </Typography>
        </StyledAccordionSummary>
    );

    return (
        <StyledAccordion expanded={expanded} onChange={handleExpand}>
            {isConstructor ? (
                <SortableTechnicItem
                    technic={technic}
                    index={index}
                    accept={technic.acceptsSelf}
                    moveTechnic={moveTechnic}
                >
                    <Summary />
                </SortableTechnicItem>
            ) : (
                <Summary />
            )}
            {isGripsNotEmpty && (
                <StyledAccordionDetails>
                    <Box
                        display="flex"
                        flexDirection="column"
                        gap={1}
                        ref={listRef}
                    >
                        {technic.grips.map((item, index) =>
                            isConstructor ? (
                                <Item key={index} elevation={2}>
                                    <Typography noWrap>{item.text}</Typography>
                                    <IconButton
                                        size="small"
                                        onClick={() => removeGrip(index)}
                                    >
                                        <ClearIcon sx={{ fontSize: 18 }} />
                                    </IconButton>
                                </Item>
                            ) : (
                                <Typography key={index}>{item.text}</Typography>
                            )
                        )}
                    </Box>
                </StyledAccordionDetails>
            )}
        </StyledAccordion>
    );
}

export default Accordion;

Accordion.propTypes = {
    technic: PropTypes.object,
    moveTechnic: PropTypes.func,
    index: PropTypes.number,
    removeItem: PropTypes.func,
    isConstructor: PropTypes.bool,
    removeGrip: PropTypes.func,
};
