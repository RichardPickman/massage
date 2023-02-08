import React from 'react';
import { useSelector } from 'react-redux';
import { Alert as AlertStyle, Button } from '@mui/material';
import Link from '../../../../components/Link';

function Alert() {
    const { savedMassageId, title } = useSelector((state) => state.massage);

    return (
        <AlertStyle
            severity="success"
            action={
                <Link to={`../${savedMassageId}`}>
                    <Button size="small">{title}</Button>
                </Link>
            }
        />
    );
}

export default Alert;
