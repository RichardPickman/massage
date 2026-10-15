import { useAutoAnimate } from '@formkit/auto-animate/react';

function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

export default function TransferList({
    predefinedRight = [],
    onDataChange,
    predefinedLeft = [],
}) {
    const [checked, setChecked] = useState([]);
    const [left, setLeft] = useState(predefinedLeft);
    const [right, setRight] = useState(predefinedRight);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const handleAllRight = () => {
        setRight(right.concat(left));
        onDataChange([]);
        setLeft([]);
    };

    const handleAllLeft = () => {
        setLeft(left.concat(right));
        onDataChange(left.concat(right));
        setRight([]);
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        onDataChange(not(left, leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        onDataChange(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const customList = (items) => {
        const [listRef] = useAutoAnimate();

        return (
            <Paper
                sx={{
                    width: 200,
                    height: 230,
                    overflow: 'auto',
                }}
            >
                <List ref={listRef} dense component="div" role="list">
                    {items.map((item) => {
                        const labelId = `transfer-list-item-${item.title}-label`;

                        return (
                            <ListItem
                                key={item.id}
                                role="listitem"
                                onClick={handleToggle(item)}
                            >
                                <ListItemIcon>
                                    <Checkbox
                                        checked={checked.indexOf(item) !== -1}
                                        tabIndex={-1}
                                        disableRipple
                                        inputProps={{
                                            'aria-labelledby': labelId,
                                        }}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    id={labelId}
                                    primary={item.title}
                                />
                            </ListItem>
                        );
                    })}
                </List>
            </Paper>
        );
    };

    return (
        <Grid container alignItems="center" justifyContent="center">
            <Grid
                item
                xs={12}
                md={5}
                alignItems="center"
                justifyContent="center"
            >
                {customList(left)}
            </Grid>
            <Grid
                item
                xs={12}
                md={2}
                alignItems="center"
                justifyContent="center"
            >
                <Grid container alignItems="center" justifyContent="center">
                    <IconButton
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleAllRight}
                        disabled={left.length === 0}
                        aria-label="move all right"
                    >
                        <KeyboardDoubleArrowRightOutlinedIcon />
                    </IconButton>
                    <IconButton
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                        aria-label="move selected right"
                    >
                        <KeyboardArrowRightOutlinedIcon />
                    </IconButton>
                    <IconButton
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                        aria-label="move selected left"
                    >
                        <KeyboardArrowLeftOutlinedIcon />
                    </IconButton>
                    <IconButton
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleAllLeft}
                        disabled={right.length === 0}
                        aria-label="move all left"
                    >
                        <KeyboardDoubleArrowLeftOutlinedIcon />
                    </IconButton>
                </Grid>
            </Grid>
            <Grid
                item
                xs={12}
                md={5}
                alignItems="center"
                justifyContent="center"
            >
                {customList(right)}
            </Grid>
        </Grid>
    );
}
