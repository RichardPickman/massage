import React, { useMemo, useState } from 'react';
import { createContext } from 'react';
import { Backdrop, CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';

export const LoadingContext = createContext({
    isLoading: false,
});

export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const loadingMode = useMemo(
        () => ({
            toggleLoading: (state) => setIsLoading(state),
            isLoading,
        }),
        [isLoading]
    );

    return (
        <LoadingContext.Provider value={loadingMode}>
            {children}
            <Backdrop open={isLoading}>
                <CircularProgress />
            </Backdrop>
        </LoadingContext.Provider>
    );
};

LoadingProvider.propTypes = {
    children: PropTypes.node,
};
