import { useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Auth, type AuthFormData } from '../../forms/Auth';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchRegister } from '../../store/reducers/auth/fetch';
import { cleanUp } from '../../store/reducers/auth/user';
import { fetchStatuses } from '../../utils/consts';

const SignUp = () => {
    const { status, error } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const onSubmit = (data: AuthFormData) => {
        dispatch(fetchRegister(data)).then((result) => {
            if (fetchRegister.fulfilled.match(result)) {
                navigate('/auth/login', { replace: true });
            }
        });
    };

    useLayoutEffect(() => {
        dispatch(cleanUp());
    }, [dispatch]);

    return (
        <Auth
            submitting={status === fetchStatuses.PENDING}
            errorData={status === fetchStatuses.FAILED ? error : null}
            onSubmit={onSubmit}
            header={'Sign Up'}
        />
    );
};

export default SignUp;
