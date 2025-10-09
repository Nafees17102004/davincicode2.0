import axios from "axios";
const API_BASE_URL = "http://localhost:5000/code"; // Replace with your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
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

const insertSnippet = (snippetData) => {
  return api.post("/insertSnippet", snippetData);
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

const viewLovDets = (lovId) => {
  return api.get(`/getSnippetById/${lovId}`);
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
  getFieldTypes,
  insertLov,
  viewLovs,
  insertLovDet,
  viewLovDets,
  viewLovById,
};

export default projectAPI;
