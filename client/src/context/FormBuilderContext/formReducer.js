export const ACTION_TYPES = {
  UPDATE_CONFIG: "UPDATE_CONFIG",
  UPDATE_FIELD: "UPDATE_FIELD",
  ADD_TAB: "ADD_TAB",
  REMOVE_TAB: "REMOVE_TAB",
  ADD_SECTION: "ADD_SECTION",
  REMOVE_SECTION: "REMOVE_SECTION",
  ADD_COLUMN: "ADD_COLUMN",
  REMOVE_COLUMN: "REMOVE_COLUMN",
  UPDATE_TOAST: "UPDATE_TOAST",
  SET_LOADING: "SET_LOADING",
  SET_DROPDOWN_DATA: "SET_DROPDOWN_DATA",
};

const generateId = () => {
  const min = 1;
  const max = 100;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// --- Default Structures ---
const defaultColumn = (order = 1) => ({
  column_id: generateId(),
  labelName: "",
  fieldType: "",
  fieldSourceLovDetId: "",
  spName: null,
  spParam: null,
  tableName: null,
  tableColumns: null,
  eventHandlers: [],
  placeholder: "",
  validations: [],
  fieldIconLovDetId: "",
  fieldOrderLovDetId: order,
  storingSP: "",
  created_user: "",
  hasEvents: false,
});

const defaultSection = () => ({
  sectionIndex: generateId(),
  sectionType: "New Section",
  fields: [defaultColumn()],
});

const defaultTab = (count) => ({
  tabName: `Tab ${count}`,
  tabIcon: "",
  sections: [defaultSection()],
});

const initialState = {
  config: {
    projectId: "",
    productId: "",
    moduleId: "",
    layoutId: "",
    pageName: "",
    purpose: "",
    tabs: [],
  },
  toasts: [],
  isLoading: true,
  dropdownData: {
    fieldSource: [],
    fieldIcon: [],
    fieldOrder: [],
    jsVal: [],
    projectData: [],
    moduleData: [],
    iconData: [],
    spList: [],
    tableList: [],
    fieldType: [],
    storedProcedures: [],
    eventHandler: [],
    layout: [],
    productData: [],
  },
  spParamData: [],
  tableCol: [],
  retrivedFormGenData: [],
  showJson: false,
};

const formReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.UPDATE_CONFIG:
      return {
        ...state,
        config:
          typeof action.payload === "function"
            ? action.payload(state.config)
            : action.payload,
      };
    case ACTION_TYPES.UPDATE_FIELD:
      const { path, key, value } = action.payload;
      const { tabIndex, sectionIndex, fieldIndex } = path;

      return {
        ...state,
        config: {
          ...state.config,
          tabs: state.config.tabs.map((tab, tIndex) => {
            if (tIndex !== tabIndex) return tab;
            return {
              ...tab,
              sections: tab.sections.map((section, sIndex) => {
                if (sIndex !== sectionIndex) return section;
                return {
                  ...section,
                  fields: section.fields.map((field, fIndex) => {
                    if (fIndex !== fieldIndex) return field;

                    const updatedField = { ...field, [key]: value };

                    // Reset chain values (same logic as before)
                    if (key === "fieldSourceLovDetId") {
                      updatedField.spName = null;
                      updatedField.spParam = null;
                      updatedField.tableName = null;
                      updatedField.tableColumns = null;
                    }

                    if (key === "spName") {
                      updatedField.spParam = null;
                      updatedField.tableName = null;
                      updatedField.tableColumns = null;
                    }

                    if (key === "tableName") {
                      updatedField.spName = null;
                      updatedField.spParam = null;
                      updatedField.tableColumns = null;
                    }

                    if (key === "hasEvents" && !value) {
                      updatedField.eventHandlers = [];
                    }

                    return updatedField;
                  }),
                };
              }),
            };
          }),
        },
      };
    case ACTION_TYPES.ADD_TAB:
      return {
        ...state,
        config: {
          ...state.config,
          tabs: [
            ...state.config.tabs,
            defaultTab(state.config.tabs.length + 1),
          ],
        },
      };
    case ACTION_TYPES.REMOVE_TAB:
      return {
        ...state,
        config: {
          ...state.config,
          tabs: state.config.tabs((_, i) => i !== action.payload),
        },
      };
    case ACTION_TYPES.ADD_SECTION:
      return {
        ...state,
        config: {
          ...state.config,
          tabs: state.tabs.map((tab, tIndex) => {
            if (tIndex === tabIndex) return tab;
            return {
              ...tab,
              section: [...tab.sections, defaultSection()],
            };
          }),
        },
      };
    case ACTION_TYPES.REMOVE_SECTION:
      const { tabIndex: removeTabIndex, sectionIndex: removeSectionIndex } =
        action.payload;
      return {
        ...state,
        config: {
          ...state.config,
          tabs: state.config.tabs.map((tab, tIndex) => {
            if (tIndex !== removeTabIndex) return tab;
            return {
              ...tab,
              sections: tab.sections.filter(
                (_, sIndex) => sIndex !== removeSectionIndex
              ),
            };
          }),
        },
      };

    case ACTION_TYPES.ADD_COLUMN:
      const { tabIndex: addColTabIndex, sectionIndex: addColSectionIndex } =
        action.payload;
      return {
        ...state,
        config: {
          ...state.config,
          tabs: state.config.tabs.map((tab, tIndex) => {
            if (tIndex !== addColTabIndex) return tab;
            return {
              ...tab,
              sections: tab.sections.map((section, sIndex) => {
                if (sIndex !== addColSectionIndex) return section;
                const fields = section.fields;
                return {
                  ...section,
                  fields: [...fields, defaultColumn(fields.length + 1)],
                };
              }),
            };
          }),
        },
      };

    case ACTION_TYPES.REMOVE_COLUMN:
      const {
        tabIndex: removeColTabIndex,
        sectionIndex: removeColSectionIndex,
        columnIndex,
      } = action.payload;
      return {
        ...state,
        config: {
          ...state.config,
          tabs: state.config.tabs.map((tab, tIndex) => {
            if (tIndex !== removeColTabIndex) return tab;
            return {
              ...tab,
              sections: tab.sections.map((section, sIndex) => {
                if (sIndex !== removeColSectionIndex) return section;
                return {
                  ...section,
                  fields: section.fields.filter(
                    (_, fIndex) => fIndex !== columnIndex
                  ),
                };
              }),
            };
          }),
        },
      };

    case ACTION_TYPES.UPDATE_TOAST:
      return {
        ...state,
        toasts: action.payload,
      };

    case ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case ACTION_TYPES.SET_DROPDOWN_DATA:
      return {
        ...state,
        dropdownData: {
          ...state.dropdownData,
          ...action.payload,
        },
      };

    case ACTION_TYPES.SET_SP_PARAM_DATA:
      return {
        ...state,
        spParamData: action.payload,
      };

    case ACTION_TYPES.SET_TABLE_COL:
      return {
        ...state,
        tableCol: action.payload,
      };

    case ACTION_TYPES.SET_SHOW_JSON:
      return {
        ...state,
        showJson: action.payload,
      };
    default:
      return state;
  }
};
export { formReducer, initialState };
