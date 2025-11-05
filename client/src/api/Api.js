import axios from "axios";
const API_BASE_URL = "http://localhost:5000/code"; // Replace with your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const insertProject = (projectData) => {
  return api.post("add-project", projectData);
};

const viewProjects = () => {
  return api.get("/projects");
};

const getProjectByCode = (pCode) => {
  return api.get(`/getProjectDetails/${pCode}`);
};

const insertModule = (pCode, moduleData) => {
  return api.post(`/insertModule/${pCode}`, moduleData);
};

const insertLanguage = (languageData) => {
  return api.post("/add-lang", languageData);
};

const getLangauge = () => {
  return api.get("/getLanguage");
};

const getSnippetById = (s_id) => {
  return api.get(`/getSnippetById/${s_id}`);
};

const getFieldTypes = () => {
  return api.get("/getFieldTypes");
};

const insertFieldTypes = (fieldData) => {
  return api.post("/add-field-type", fieldData);
};

// Snippet API's
const insertSnippet = (snippetData) => {
  return api.post("/insertSnippet", snippetData);
};

const getSnippet = () => {
  return api.get("/snippet");
};

// Lov API's
const insertLov = (lovData) => {
  return api.post("/insert-lov", lovData);
};

const viewLovs = () => {
  return api.get("/getLovs");
};

const viewLovById = (lovId) => {
  return api.get(`/getLov/${lovId}`);
};

const insertLovDet = (lovDetData) => {
  return api.post("/insertListOfValuesDetails", lovDetData);
};

const getLovWithDet = (lovId) => {
  return api.get(`/get-lov-with-det/${lovId}`);
};

const viewLovDets = (lovId) => {
  return api.get(`/getSnippetById/${lovId}`);
};

const getLovDropdown = (listName, lovName) => {
  return api.get(`/lov-det-drop-down/${listName}/${lovName}`);
};

const insertTabDet = (tabData) => {
  return api.post(`/insert-tab`, tabData);
};

const insertAddFormDet = (addFormData) => {
  return api.post(`/add-form-det`, addFormData);
};

const insertFormGen = (formGenData) => {
  return api.post("/form-generation/save", formGenData);
};

const viewFormGenList = () => {
  return api.get("/form-generation/get");
};

const projectAPI = {
  insertProject,
  viewProjects,
  getProjectByCode,
  insertModule,
  insertLanguage,
  getLangauge,
  getSnippetById,
  insertFieldTypes,
  insertSnippet,
  getSnippet,
  getFieldTypes,
  insertLov,
  viewLovs,
  insertLovDet,
  viewLovDets,
  viewLovById,
  getLovWithDet,
  getLovDropdown,
  insertTabDet,
  insertAddFormDet,
  insertFormGen,
  viewFormGenList,
};

export default projectAPI;
