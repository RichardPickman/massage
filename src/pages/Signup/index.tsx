import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import { Card } from '@/components/ui/card';
import { Auth, type AuthFormData } from '../../forms/Auth';
import { fetchRegister } from '../../store/reducers/auth/fetch';
import { cleanUp } from '../../store/reducers/auth/user';
import { fetchStatuses } from '../../utils/consts';

const SignUp = () => {
    const { status, error } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
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
    }, []);

    return (
        <Card>
            <Auth
                submitting={status === fetchStatuses.PENDING}
                errorData={status === fetchStatuses.FAILED ? error : null}
                onSubmit={onSubmit}
                header={'Sign Up'}
            />
        </Card>
    );
};

export default SignUp;
