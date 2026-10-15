import { Card } from '@/components/ui/card';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import React, { useMemo } from 'react';

function ListWithSearch({ arr, textKey, onDelete }) {
    const [query, setQuery] = useState('');

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
                    <Card>
                        <p>{item.title}</p>
                        <IconButton
                            size="small"
                            color="error"
                            onClick={() => onDelete(item._id)}
                        >
                            <DeleteOutlineOutlinedIcon />
                        </IconButton>
                    </Card>
                ))}
            </Paper>
        </Paper>
    );
}

export default ListWithSearch;
