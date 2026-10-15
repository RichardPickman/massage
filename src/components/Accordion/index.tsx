import React, { memo, useState } from 'react';
import { StyledAccordion } from './styles';

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
