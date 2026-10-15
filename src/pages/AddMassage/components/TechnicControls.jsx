import React, { memo } from 'react';
import { Card } from '../../../components/ui/card';
import Technics from './TechnicControls/Technics';
import Title from './TechnicControls/Title';

function TechnicControls() {
    return (
        <Card>
            <Title />
            <Technics />
        </Card>
    );
}

export default memo(TechnicControls);
