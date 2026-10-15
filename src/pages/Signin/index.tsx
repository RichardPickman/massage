import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Card } from '@/components/ui/card';
import { Auth, type AuthFormData } from '../../forms/Auth';
import { fetchLogin } from '../../store/reducers/auth/fetch';
import { cleanUp } from '../../store/reducers/auth/user';
import { fetchStatuses } from '../../utils/consts';

const SignIn = () => {
    const { status, error } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = (data: AuthFormData) => {
        dispatch(fetchLogin(data)).then((result) => {
            if (fetchLogin.fulfilled.match(result)) {
                navigate('/', { replace: true });
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
                header={'Sign In'}
            />
        </Card>
    );
};

export default SignIn;
