import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import AnimatedList from '../../../components/AnimatedList';
import TechnicItem from './TechnicItem';

function TechnicsList() {
    const { technics } = useSelector((state) => state.massage);

    return (
        <AnimatedList overflow="auto">
            {technics.map((technic, index) => (
                <TechnicItem
                    key={technic.id}
                    technic={technic}
                    technicIndex={index}
                    value={index}
                />
            ))}
        </AnimatedList>
    );
}

export default TechnicsList;
