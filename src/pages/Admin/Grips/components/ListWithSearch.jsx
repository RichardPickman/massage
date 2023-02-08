import React, { useMemo } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Box, IconButton, Paper, TextField, Typography } from '@mui/material';

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

import PropTypes from 'prop-types';

function ListWithSearch({ arr, textKey, onDelete }) {
    const [query, setQuery] = React.useState('');

    const filteredItems = useMemo(
        () =>
            arr.filter((item) =>
                item[textKey].toLowerCase().includes(query.toLowerCase())
            ),
        [query, arr]
    );

    const [gridRef] = useAutoAnimate();
    return (
        <Paper
            variant="outlined"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                width: '80%',
                p: 2,
            }}
        >
            <TextField
                fullWidth
                label="Search..."
                onChange={(e) => setQuery(e.target.value)}
            />
            <Paper
                ref={gridRef}
                variant="outlined"
                sx={{
                    p: 2,
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    gap: 1,
                }}
            >
                {filteredItems.map((item) => (
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        key={item._id}
                    >
                        <Typography>{item.title}</Typography>
                        <IconButton
                            size="small"
                            color="error"
                            onClick={() => onDelete(item._id)}
                        >
                            <DeleteOutlineOutlinedIcon />
                        </IconButton>
                    </Box>
                ))}
            </Paper>
        </Paper>
    );
}

ListWithSearch.propTypes = {
    arr: PropTypes.array,
    textKey: PropTypes.string,
    onDelete: PropTypes.func,
};

export default ListWithSearch;
