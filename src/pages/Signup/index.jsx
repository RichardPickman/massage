import React, { useEffect, useLayoutEffect } from 'react';
import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import Auth from '../../forms/Auth';
import { fetchRegister } from '../../store/reducers/auth/fetch';
import { cleanUp, clearError } from '../../store/reducers/auth/user';
import { useNavigate } from 'react-router-dom';
import { fetchStatuses } from '../../utils/consts';

const SignUp = () => {
    const { status, allowRedirect, error } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = (data) => dispatch(fetchRegister(data));

    useLayoutEffect(() => {
        dispatch(cleanUp());
    }, []);

    useEffect(() => {
        if (status === fetchStatuses.SUCCEEDED && allowRedirect) {
            dispatch(clearError());

            return navigate('/', { replace: true });
        }
    }, [status, allowRedirect]);

    return (
        <Box>
            <Auth
                submitting={status === 'pending'}
                errorData={status === 'failed' ? error : null}
                onSubmit={onSubmit}
                header={'Sign Up'}
            />
        </Box>
    );
};

export default SignUp;
