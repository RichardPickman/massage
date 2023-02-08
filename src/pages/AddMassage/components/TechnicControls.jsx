import React, { memo } from 'react';
import { Box } from '@mui/material';
import Title from './TechnicControls/Title';
import Technics from './TechnicControls/Technics';

function TechnicControls() {
    return (
        <Box display="flex" flexDirection="column" gap={2}>
            <Title />
            <Technics />
        </Box>
    );
}

export default memo(TechnicControls);
