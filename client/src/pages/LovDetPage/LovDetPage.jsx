import React from "react";
import LovDetForm from "../../components/LovDet/LovDetForm/LovDetForm";
import LeftTabMenu from "../../components/LeftTabMenu/LeftTabMenu";

function LovDetPage() {
  return (
    <div>
      <div>
        <LeftTabMenu />
      </div>

      <div>
        <LovDetForm />
      </div>
    </div>
  );
}

export default LovDetPage;
