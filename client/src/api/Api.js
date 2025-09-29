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

const insertFieldTypes = (fieldData) => {
  return api.post("/add-field-type", fieldData);
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
};

export default projectAPI;
