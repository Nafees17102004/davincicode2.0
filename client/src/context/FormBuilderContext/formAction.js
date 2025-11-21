import { ACTION_TYPES } from "./actionTypes";
export const updateConfig = (updater) => ({
  type: ACTION_TYPES.UPDATE_CONFIG,
  payload: updater,
});

export const updateField = (path, key, value) => ({
  type: ACTION_TYPES.UPDATE_FIELD,
  payload: { path, key, value },
});

export const addTab = () => ({
  type: ACTION_TYPES.ADD_TAB,
});

export const removeTab = (tabIndex) => ({
  type: ACTION_TYPES.REMOVE_TAB,
  payload: tabIndex,
});

export const addSection = (tabIndex) => ({
  type: ACTION_TYPES.ADD_SECTION,
  payload: {tabIndex},
});

export const removeSection = (tabIndex, sectionIndex) => ({
  type: ACTION_TYPES.REMOVE_SECTION,
  payload: { tabIndex, sectionIndex },
});

export const addColumn = (tabIndex, sectionIndex) => ({
  type: ACTION_TYPES.ADD_COLUMN,
  payload: { tabIndex, sectionIndex },
});

export const removeColumn = (tabIndex, sectionIndex, columnIndex) => ({
  type: ACTION_TYPES.REMOVE_COLUMN,
  payload: { tabIndex, sectionIndex, columnIndex },
});

export const updateToast = (toasts) => ({
  type: ACTION_TYPES.UPDATE_TOAST,
  payload: toasts,
});

// Setters
export const setFormGenData = (formData) => ({
  type: ACTION_TYPES.SET_FORM_DATA,
  payload: formData,
});

export const setLoading = (isLoading) => ({
  type: ACTION_TYPES.SET_LOADING,
  payload: isLoading,
});

export const setDropdownData = (data) => ({
  type: ACTION_TYPES.SET_DROPDOWN_DATA,
  payload: data,
});

export const setSpParamData = (data) => ({
  type: ACTION_TYPES.SET_SP_PARAM_DATA,
  payload: data,
});

export const setTableCol = (data) => ({
  type: ACTION_TYPES.SET_TABLE_COL,
  payload: data,
});

export const setShowJson = (show) => ({
  type: ACTION_TYPES.SET_SHOW_JSON,
  payload: show,
});

// export const addValidation = (path, validation) => ({
//   type: ACTION_TYPES.ADD_VALIDATION,
//   payload: { path, validation },
// });

// export const updateValidation = (path, index, key, value) => ({
//   type: ACTION_TYPES.UPDATE_VALIDATION,
//   payload: { path, index, key, value },
// });

// export const removeValidation = (path, index) => ({
//   type: ACTION_TYPES.REMOVE_VALIDATION,
//   payload: { path, index },
// });
