import React from "react";
import LovForm from "../../components/Lov/LovForm/LovForm";
import LeftTabMenu from "../../components/LeftTabMenu/LeftTabMenu";

function LovPage() {
  return (
    <div>
      <div>
        <LeftTabMenu />
      </div>

      <div>
        <LovForm />
      </div>
    </div>
  );
}

export default LovPage;
