import * as React from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import PropTypes from 'prop-types';
import { drawerWidth } from '../../../../layouts/Admin';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import KeyboardDoubleArrowUpOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowUpOutlined';
import KeyboardDoubleArrowDownOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowDownOutlined';
import KeyboardDoubleArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowLeftOutlined';
import KeyboardDoubleArrowRightOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowLeftOutlined';
import { IconButton } from '@mui/material';
import { useAutoAnimate } from '@formkit/auto-animate/react';

function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

export default function TransferList({
    predefinedRight,
    onLessonChange,
    predefinedLeft,
}) {
    const [checked, setChecked] = React.useState([]);
    const [left, setLeft] = React.useState(
        predefinedLeft ? predefinedLeft : []
    );
    const [right, setRight] = React.useState(
        predefinedRight ? predefinedRight : []
    );

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const width = window.innerWidth - drawerWidth;

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
        onLessonChange([]);
        setLeft([]);
    };

    const handleAllLeft = () => {
        setLeft(left.concat(right));
        onLessonChange(left.concat(right));
        setRight([]);
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        onLessonChange(not(left, leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        onLessonChange(left.concat(rightChecked));
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
        <Grid container spacing={1} alignItems="center" justifyContent="center">
            <Grid
                item
                xs={12}
                md={5}
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                {customList(left)}
            </Grid>
            <Grid
                item
                xs={12}
                md={2}
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Grid
                    container
                    direction={width <= 768 ? 'row' : 'column'}
                    display="flex"
                    height="100%"
                    alignItems="center"
                    justifyContent="center"
                >
                    <IconButton
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleAllRight}
                        disabled={left.length === 0}
                        aria-label="move all right"
                    >
                        {width <= 768 ? (
                            <KeyboardDoubleArrowDownOutlinedIcon />
                        ) : (
                            <KeyboardDoubleArrowRightOutlinedIcon />
                        )}
                    </IconButton>
                    <IconButton
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                        aria-label="move selected right"
                    >
                        {width <= 768 ? (
                            <KeyboardArrowDownOutlinedIcon />
                        ) : (
                            <KeyboardArrowRightOutlinedIcon />
                        )}
                    </IconButton>
                    <IconButton
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                        aria-label="move selected left"
                    >
                        {width <= 768 ? (
                            <KeyboardArrowUpOutlinedIcon />
                        ) : (
                            <KeyboardArrowLeftOutlinedIcon />
                        )}
                    </IconButton>
                    <IconButton
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleAllLeft}
                        disabled={right.length === 0}
                        aria-label="move all left"
                    >
                        {width <= 768 ? (
                            <KeyboardDoubleArrowUpOutlinedIcon />
                        ) : (
                            <KeyboardDoubleArrowLeftOutlinedIcon />
                        )}
                    </IconButton>
                </Grid>
            </Grid>
            <Grid
                item
                xs={12}
                md={5}
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                {customList(right)}
            </Grid>
        </Grid>
    );
}

TransferList.propTypes = {
    predefinedRight: PropTypes.array,
    predefinedLeft: PropTypes.array,
    onLessonChange: PropTypes.func,
};
