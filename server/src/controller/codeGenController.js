const service = require("../service/codeGenService");

const getProjectDetails=async(req,res)=>{
    try {
        const { project_code }=req.body;
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
    const { project_id, name, status, inactive_reason } = req.body;

    
    if (project_id === undefined ||name === undefined ||status === undefined ||inactive_reason === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await service.insertModule(project_id,name,status,inactive_reason);

    if (!result||result.affectedRows===0) {
      return res.status(201).json({ success: "false", message: "insertion failed" });
    }

    res.status(201).json({ success: true, data: result });
  } catch (err) {
    console.error("err in controller", err);
    res.status(400).json({
      success: false,
      message: err.sqlMessage || err.message,
    });
  }
};

module.exports = { insertModule ,getProjectDetails};
