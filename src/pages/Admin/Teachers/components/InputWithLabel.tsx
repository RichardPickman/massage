import { drawerWidth } from '../../../../layouts/Admin';

function InputWithLabel({
    caption,
    value,
    onChange,
    label = '',
    isError = false,
    helperText = '',
}) {
    const width = window.innerWidth - drawerWidth;

    return (
        <Stack
            direction="row"
            justifyContent={width <= 768 ? 'space-between' : 'right'}
            alignItems="center"
        >
            <p>{caption}:</p>
            <TextField
                value={value}
                onChange={onChange}
                label={label}
                error={isError}
                helperText={helperText}
            />
        </Stack>
    );
}

export default InputWithLabel;
