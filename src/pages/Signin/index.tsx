import { useLayoutEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { readSignInReturnPath } from '@/components/RequireAuth/helpers';
import { LanguageSwitch } from '../../components/LanguageSwitch';
import { Auth, type AuthFormData } from '../../forms/Auth';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchLogin } from '../../store/reducers/auth/fetch';
import { cleanUp } from '../../store/reducers/auth/user';
import { fetchStatuses } from '../../utils/consts';

const SignIn = () => {
    const { status, error } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const returnPath = readSignInReturnPath(location.state);

    const onSubmit = (data: AuthFormData) => {
        dispatch(fetchLogin(data)).then((result) => {
            if (fetchLogin.fulfilled.match(result)) {
                navigate(returnPath ?? '/', { replace: true });
            }
        });
    };

    useLayoutEffect(() => {
        dispatch(cleanUp());
    }, [dispatch]);

    return (
        <div className="flex flex-col gap-4">
            <Auth
                submitting={status === fetchStatuses.PENDING}
                errorData={status === fetchStatuses.FAILED ? error : null}
                onSubmit={onSubmit}
                mode="signIn"
            />
            <LanguageSwitch className="mx-auto" />
        </div>
    );
};

export default SignIn;
