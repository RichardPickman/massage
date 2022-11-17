import React from 'react';
import PropTypes from 'prop-types';

export const combineComponents = (...components) => {
    return components.reduce(
        (AccumulatedComponents, CurrentComponent) => {
            return function wrapper({ children }) {
                return (
                    <AccumulatedComponents>
                        <CurrentComponent>{children}</CurrentComponent>
                    </AccumulatedComponents>
                );
            };
        },
        ({ children }) => <>{children}</>
    );
};

combineComponents.propTypes = {
    components: PropTypes.array,
};
