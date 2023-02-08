import { TextField } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeTitle } from '../../../../store/reducers/massage';

function Title() {
    const { title, errors } = useSelector((state) => state.massage);
    const dispatch = useDispatch();

    const handleTitle = (e) => {
        dispatch(changeTitle({ title: e.target.value }));
    };

    return (
        <TextField
            value={title}
            onChange={handleTitle}
            error={errors.title.isError}
            helperText={errors.title.text}
            label="Title"
            size="small"
        />
    );
}

export default Title;
