import React, { memo, useState } from 'react';
import { StyledAccordion } from './styles';
import PropTypes from 'prop-types';

function Accordion({ children }) {
    const [expanded, setExpanded] = useState(true);

    const handleExpand = (e, isExpanded) => setExpanded(isExpanded);

    return (
        <StyledAccordion expanded={expanded} onChange={handleExpand}>
            {children}
        </StyledAccordion>
    );
}

export default memo(Accordion);

Accordion.propTypes = {
    technic: PropTypes.object,
    technicIndex: PropTypes.number,
    removeItem: PropTypes.func,
    isConstructor: PropTypes.bool,
    removeGrip: PropTypes.func,
    children: PropTypes.node,
};
