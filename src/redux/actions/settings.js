import {
    SET_DISPLAY_MODE,
    SET_ITEMS_PER_ROW,
    UPDATE_READER_TEXT_SIZE,
    UPDATE_READER_THEME,
} from "./types";

export const setDisplayMode = (val) => (dispatch) => {
    dispatch({
        type: SET_DISPLAY_MODE,
        payload: val,
    });
};

export const setItemsPerRow = (val) => (dispatch) => {
    dispatch({
        type: SET_ITEMS_PER_ROW,
        payload: val,
    });
};

export const updateReaderTheme = (val) => (dispatch) => {
    dispatch({
        type: UPDATE_READER_THEME,
        payload: val,
    });
};

export const updateReaderTextSize = (val) => (dispatch) => {
    dispatch({
        type: UPDATE_READER_TEXT_SIZE,
        payload: val,
    });
};