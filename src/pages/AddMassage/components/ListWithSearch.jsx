import { useAutoAnimate } from '@formkit/auto-animate/react';
import React, { memo, useMemo, useState } from 'react';
import { Card } from '../../../components/ui/card';
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
        <Card>
            <CardContent>
                <Card flex gap={2}>
                    <TextField
                        value={query}
                        label="Search"
                        size="small"
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <Card ref={listRef} overflow="auto">
                        <Stack ref={listRef}>
                            {filteredItems.map((grip) => (
                                <DragItem
                                    key={grip._id}
                                    item={grip}
                                    type={grip.type}
                                >
                                    <Item elevation={2}>
                                        <p sx={{ width: '90%' }}>
                                            {grip.title}
                                        </p>
                                        <DragIndicatorOutlinedIcon />
                                    </Item>
                                </DragItem>
                            ))}
                        </Stack>
                    </Card>
                </Card>
            </CardContent>
        </Card>
    );
}

export default memo(ListWithSearch);
