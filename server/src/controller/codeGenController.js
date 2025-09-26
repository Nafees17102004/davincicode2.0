const service = require("../service/codeGenService");

const getProjectDetails=async(req,res)=>{
    try {
        const project_code=req.params.p_code;
        if(!project_code){
            return res.status(400).json({message:"missing field"});
        }
        const result=await service.getProjectDetails(project_code);
        res.status(200).json({success:"true",result});
    } catch (err) {
        res.status(500).json(err);
    }
};  

const insertModule = async (req, res) => {
  try {
    const modules = Array.isArray(req.body) ? req.body : [req.body];
    const results=[];
    const errors = [];

    for (const [index, module] of modules.entries()) {
          const { project_id,m_name,m_desc,status,inactive_reason} = module;
        
          if (!project_id || !m_name || !status) {
              errors.push({ index, error: "All fields are required", module: module });
              continue; // skip this one, continue with next
            }

            try{
                const result= await service.insertModule(project_id,m_name,m_desc,status,inactive_reason);
                results.push({...module,dbResult:result})
            }catch(err){
                errors.push({index,error:err.message,module: module});
            }
          }

          res.status(201).json({ 
            message: "Processing completed",
            addedCount: results.length,
            failedCount: errors.length,
            addedProjects: results,
            failedProjects: errors 
          });
  } catch (err) {
    console.error("err in controller", err);
    res.status(400).json({
      success: false,
      message: err.sqlMessage || err.message,
    });
  }
};

module.exports = { insertModule ,getProjectDetails};
