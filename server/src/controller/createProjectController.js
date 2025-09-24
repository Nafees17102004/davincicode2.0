const createProjectService = require('../service/createProjectService');

const insertProject = async (req,res) =>{
    try {
        const {pCode, pName, pLanguageId, pStatus, pInactiveReason} = req.body;
        await createProjectService.insertProject(pCode, pName, pLanguageId, pStatus, pInactiveReason);
        res.json({message: "Insert query is successful"})
    } catch(err){
        res.status(500).json({message: err.message});
    }
}

module.exports = {
    insertProject
}