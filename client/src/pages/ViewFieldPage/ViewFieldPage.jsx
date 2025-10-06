import { useEffect } from "react";
import projectAPI from "../../api/Api";
import ViewFieldTable from "../../components/ViewFieldTable/ViewFieldTable";
import { useState } from "react";

function ViewFieldPage() {
  const [rows, setRows] = useState([]);

  useEffect(()=>{
    fetchFieldTypes();
  },[])
  const fetchFieldTypes = async () => {
    try {
      await projectAPI.getFieldTypes().then((res) => {
        const formatData = res.data.map((eachData) => ({
          fTypeId: eachData.FIELD_TYPE_ID,
          fName: eachData.FIELD_NAME,
          fStatus: eachData.status,
          fInactiveReason: eachData.inactive_reason,
        }));
        setRows(formatData);
      });
    } catch (error) {
      console.error(error);
    }
  };

  console.log(rows);
  return (
    <div>
      <ViewFieldTable rows={rows} />
    </div>
  );
}

export default ViewFieldPage;
