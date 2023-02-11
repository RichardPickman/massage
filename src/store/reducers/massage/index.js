import { createSlice } from '@reduxjs/toolkit';
import { fetchStatuses } from '../../../utils/consts';
import { getTechnic, getTemplate } from './helpers';
import produce from 'immer';
import update from 'immutability-helper';
import { fetchCreate } from './fetch';
import { statusCallbacks } from '../staticCallbacks';

const titleError = {
    isError: false,
    text: '',
};

const initialState = {
    technics: [],
    title: '',
    status: fetchStatuses.IDLE,
    savedMassageId: null,
    errors: {
        title: titleError,
    },
};

const massageSlice = createSlice({
    name: 'massage',
    initialState: initialState,
    reducers: {
        addTechnic: (state, action) => {
            const { title } = action.payload;
            const technics = produce(
                state.technics,
                (draft) => (draft = [...draft, getTechnic(title)])
            );

            state.technics = technics;
        },
        addTemplateTechnics: (state) => {
            return {
                ...state,
                technics: getTemplate(),
            };
        },
        removeTechnic: (state, action) => {
            const { technicId } = action.payload;
            const technics = produce(state.technics, (draft) => {
                return draft.filter((technic) => technic.id !== technicId);
            });

            state.technics = technics;
        },
        removeGrip: (state, action) => {
            const { technicIndex, gripId } = action.payload;
            const technics = produce(state.technics, (technics) => {
                const grips = technics[technicIndex].grips;
                const technic = technics[technicIndex];

                technic.grips = grips.filter((item) => item._id !== gripId);
            });

            state.technics = technics;
        },
        addGrip: (state, action) => {
            const { technicIndex, item } = action.payload;

            const technics = produce(state.technics, (draft) => {
                const hasItem = draft[technicIndex].grips.find(
                    (elem) => elem._id === item._id
                );

                if (!hasItem) {
                    draft[technicIndex].grips.push(item);
                }
            });

            state.technics = technics;
        },
        changeTitle: (state, action) => {
            const { title } = action.payload;

            if (state.errors.title.isError) {
                state.errors.title = titleError;
            }

            state.title = title;
        },
        moveTechnic: (state, action) => {
            const { dragIndex, hoverIndex } = action.payload;
            const arr = update(state.technics, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, state.technics[dragIndex]],
                ],
            });

            state.technics = arr;
        },
        clearData: () => {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCreate.fulfilled, (state, action) => {
            state.status = fetchStatuses.SUCCEEDED;
            state.savedMassageId = action.payload._id;
        });
        builder.addCase(fetchCreate.pending, statusCallbacks.PENDING);
        builder.addCase(fetchCreate.rejected, (state, action) => {
            if (action.payload.message === 'Validation error') {
                const title = {
                    isError: true,
                    text: action.payload.errors[0].msg,
                };

                state.errors.title = title;
            }
        });
    },
});

export const {
    addTechnic,
    removeTechnic,
    removeGrip,
    changeTitle,
    addGrip,
    moveTechnic,
    addTemplateTechnics,
    clearData,
} = massageSlice.actions;

export default massageSlice.reducer;
