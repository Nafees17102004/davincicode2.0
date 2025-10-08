import { useState, useEffect } from "react";
import projectAPI from "../../api/Api";
import ViewLovStaticGrid from "../../components/Lov/ViewLovStaticGrid/ViewLovStaticGrid";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

function ViewLovPage() {
  const [lovs, setLovs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLovs();
  }, []);

  const fetchLovs = () => {
    projectAPI
      .viewLovs()
      .then((response) => {
        console.log(response.data);
        const formattedData = response.data.result.map((eachItem) => ({
          lovId: eachItem.LOV_ID,
          lovName: eachItem.LOV_NAME,
          lovDescp: eachItem.LOV_DESCRIPTION,
          lovStatus: eachItem.LOV_STATUS,
          lovInactiveReason: eachItem.INACTIVE_REASON,
          createdUser: eachItem.cUser,
        }));
        setLovs(formattedData);
      })
      .catch((err) => {
        console.error("Error: ", err);
      });
  };

  const handleBack = () => {
    navigate("/lov");
  };

  return (
    <div className="view-projects-page p-4">
      <div className="main-content">
        <ViewLovStaticGrid rows={lovs} />
        <Button onClick={handleBack} variant="danger">
          Back
        </Button>
      </div>
    </div>
  );
}

export default ViewLovPage;
