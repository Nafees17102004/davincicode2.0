import { produce } from "immer";

import { ACTION_TYPES } from "./actionTypes";

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
  customName: null,
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
    fieldTypeData: [],
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
    case ACTION_TYPES.SET_FORM_DATA:
      return {
        ...state,
        retrivedFormGenData: action.payload,
      };
    case ACTION_TYPES.UPDATE_CONFIG:
      return {
        ...state,
        config:
          typeof action.payload === "function"
            ? action.payload(state.config)
            : action.payload,
      };
    case ACTION_TYPES.UPDATE_FIELD:
      return produce(state, (draft) => {
        const [tabIndex, sectionIndex, fieldIndex] = action.payload.path;
        const { key, value } = action.payload;

        // ...state,
        // config: {
        //   ...state.config,
        //   tabs: state.config.tabs.map((tab, tIndex) => {
        //     if (tIndex !== tabIndex) return tab;
        //     return {
        //       ...tab,
        //       sections: tab.sections.map((section, sIndex) => {
        //         if (sIndex !== sectionIndex) return section;
        //         return {
        //           ...section,
        //           fields: section.fields.map((field, fIndex) => {
        //             if (fIndex !== fieldIndex) return field;

        //             const updatedField = { ...field, [key]: value };

        const field =
          draft.config.tabs[tabIndex].sections[sectionIndex].fields[fieldIndex];

        field[key] = value;

        // --- Chain Reset Rules ---
        if (key === "fieldSourceLovDetId") {
          field.spName = null;
          field.spParam = null;
          field.tableName = null;
          field.tableColumns = null;
        }

        if (key === "spName") {
          field.spParam = null;
          field.tableName = null;
          field.tableColumns = null;
        }

        if (key === "tableName") {
          field.spName = null;
          field.spParam = null;
          field.tableColumns = null;
        }

        if (key === "hasEvents" && !value) {
          field.eventHandlers = [];
        }
      });

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
      const updatedTabs = state.config.tabs.filter(
        (_, i) => i !== action.payload
      );

      // Auto rename tabs (Tab 1, Tab 2, ...)
      updatedTabs.forEach((tab, index) => {
        tab.tabName = tab.tabName.startsWith("Tab")
          ? `Tab ${index + 1}`
          : tab.tabName;
      });

      return {
        ...state,
        config: {
          ...state.config,
          tabs: updatedTabs,
        },
      };

    case ACTION_TYPES.ADD_SECTION:
      // return produce(state, (draft) => {
      //   const { tabIndex } = action.payload;
      //   // Ensure sections is an array
      //   if (!Array.isArray(draft.config.tabs[tabIndex].sections)) {
      //     draft.config.tabs[tabIndex].sections = [];
      //   }

      //   draft.config.tabs[tabIndex].sections.push(defaultSection());
      // });
      const { tabIndex } = action.payload;
      return {
        ...state,
        config: {
          ...state.config,
          tabs: state.config.tabs.map((tab, tIndex) => {
            if (tIndex !== tabIndex) return tab;
            return {
              ...tab,
              sections: [...tab.sections, defaultSection()],
            };
          }),
        },
      };
    case ACTION_TYPES.REMOVE_SECTION:
      const { tabIndex: removeTabIndex, sectionIndex: removeSectionIndex } =
        action.payload;
          console.log("Reducer received:", removeTabIndex, removeSectionIndex);
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
    case ACTION_TYPES.ADD_VALIDATION:
      return produce(state, (draft) => {
        const [tabIndex, sectionIndex, fieldIndex] = action.payload.path;
        draft.config.tabs[tabIndex].sections[sectionIndex].fields[
          fieldIndex
        ].validations.push(action.payload.validation);
      });

    case ACTION_TYPES.UPDATE_VALIDATION:
      return produce(state, (draft) => {
        const { path, index, key, value } = action.payload;
        const [tabIndex, sectionIndex, fieldIndex] = path;
        draft.config.tabs[tabIndex].sections[sectionIndex].fields[
          fieldIndex
        ].validations[index][key] = value;
      });

    case ACTION_TYPES.REMOVE_VALIDATION:
      return produce(state, (draft) => {
        const { path, index } = action.payload;
        const [tabIndex, sectionIndex, fieldIndex] = path;
        draft.config.tabs[tabIndex].sections[sectionIndex].fields[
          fieldIndex
        ].validations.splice(index, 1);
      });

    default:
      return state;
  }
};
export { formReducer, initialState };
