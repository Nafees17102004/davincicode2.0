import axios from "axios";
const API_BASE_URL = "http://localhost:5000/code"; // Replace with your backend URL

const api = axios.create({
    baseURL: API_BASE_URL,
})

const insertProject = (projectData) => {
    return api.post('add-project', projectData);
}

const viewProjects = () =>{
    return api.get('/projects');
}

const getProjectByCode = (pCode) => {
    return api.get(`/getProjectDetails/${pCode}`)
}

const insertModule = (pCode, moduleData)=>{
    return api.post(`/insertModule/${pCode}`,moduleData);
}

const insertLanguage = (languageData) => {
    return api.post('/add-lang', languageData);
}

const projectAPI = {
    insertProject, 
    viewProjects,
    getProjectByCode,
    insertModule,
    insertLanguage
}

export default projectAPI;