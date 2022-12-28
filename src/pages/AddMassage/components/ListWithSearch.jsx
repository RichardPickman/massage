import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import {
    Box,
    Card,
    CardContent,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import DragIndicatorOutlinedIcon from '@mui/icons-material/DragIndicatorOutlined';

import DragItem from './DragItem';
import { Item } from './helpers';

function ListWithSearch({ arr, textKey }) {
    const [query, setQuery] = useState('');
    const [listRef] = useAutoAnimate();

    const filteredItems = useMemo(
        () =>
            arr.filter((item) =>
                item[textKey].toLowerCase().includes(query.toLowerCase())
            ),
        [query]
    );

    return (
        <Card variant="outlined" sx={{ overflow: 'auto' }}>
            <CardContent>
                <Box display="flex" flexDirection="column" gap={2}>
                    <TextField
                        value={query}
                        label="Search"
                        size="small"
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <Box ref={listRef} overflow="auto">
                        <Stack spacing={1} ref={listRef}>
                            {filteredItems.map((grip) => (
                                <DragItem
                                    key={grip._id}
                                    item={grip}
                                    type={grip.type}
                                >
                                    <Item elevation={2}>
                                        <Typography
                                            noWrap
                                            sx={{ width: '90%' }}
                                        >
                                            {grip.text}
                                        </Typography>
                                        <DragIndicatorOutlinedIcon />
                                    </Item>
                                </DragItem>
                            ))}
                        </Stack>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}

ListWithSearch.propTypes = {
    arr: PropTypes.array,
    textKey: PropTypes.string,
};

export default ListWithSearch;
