const createProjectRepo = require('../repository/createProjectRepository');

const insertProject = async (pCode, pName, pLanguageId, pStatus, pInactiveReason) =>{
    try {
        const result = await createProjectRepo.insertProject(pCode, pName, pLanguageId, pStatus, pInactiveReason);
        return result;
    }catch(err){
        console.error(err)
    }
}

const viewProjectDetails = async () => {
    try {
        const result = await createProjectRepo.viewProjectDetails();
        return result;
    }catch(err){
        console.error(err);
    }
}

const insertLanguage = async (lName, lStatus, lInactiveReason) =>{
    try {
        const result = await createProjectRepo.insertLanguage(lName, lStatus, lInactiveReason);
        return result;
    } catch(err){
        console.error(err);
    }
}

const getLanguage=async()=>{
    try {
        const result=await createProjectRepo.getLanguage();
        return result;
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    insertProject,
    viewProjectDetails,
    insertLanguage
    viewProjectDetails,
    getLanguage
}