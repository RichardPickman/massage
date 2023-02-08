import React, { useLayoutEffect } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Auth from '../../forms/Auth';
import { fetchLogin } from '../../store/reducers/auth/fetch';
import { cleanUp, clearError } from '../../store/reducers/auth/user';
import { useEffect } from 'react';
import { fetchStatuses } from '../../utils/consts';

const SignIn = () => {
    const dispatch = useDispatch();
    const { status, allowRedirect, error } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const onSubmit = (data) => dispatch(fetchLogin(data));

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
                header={'Sign In'}
            />
        </Box>
    );
};

export default SignIn;
