import { Box, Dialog, IconButton, Stack, Typography } from '@mui/material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import itemTypes from '../../utils/itemTypes';
import { useDrag, useDrop } from 'react-dnd';

function ImageCard({ remove, img, text, index, moveImage }) {
    const [clicked, setClicked] = useState(false);

    const onClick = () => setClicked(!clicked);

    const ref = useRef(null);

    const [{ handlerId }, drop] = useDrop({
        accept: itemTypes.CARD,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        hover(item, monitor) {
            if (!ref.current) {
                return;
            }

            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) {
                return;
            }

            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleX =
                (hoverBoundingRect.left - hoverBoundingRect.right) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientX = clientOffset.x - hoverBoundingRect.right;

            if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
                return;
            }

            if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
                return;
            }

            moveImage(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });
    const [{ isDragging }, drag] = useDrag({
        type: itemTypes.CARD,
        item: () => ({ text, index }),
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));

    return (
        <Box
            ref={ref}
            display={isDragging ? 'none' : 'flex'}
            flexDirection="column"
            data-handler-id={handlerId}
        >
            <Box component="img" onClick={onClick} src={img} />
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Typography variant="subtitle2" noWrap>
                    {text}
                </Typography>
                <IconButton onClick={() => remove()} edge="end">
                    <DeleteOutlineOutlinedIcon color="error" />
                </IconButton>
            </Stack>
            <Dialog onClick={() => setClicked(false)} open={clicked}>
                <Box component="img" onClick={onClick} src={img} />
            </Dialog>
        </Box>
    );
}

export default ImageCard;

ImageCard.propTypes = {
    remove: PropTypes.func,
    img: PropTypes.string,
    text: PropTypes.string,
    index: PropTypes.number,
    moveImage: PropTypes.func,
};
