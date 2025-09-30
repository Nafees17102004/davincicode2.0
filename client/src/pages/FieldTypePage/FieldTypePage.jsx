import React from "react";
import FieldTypeForm from "../../components/FieldTypeForm/FieldTypeForm";
import LeftTabMenu from "../../components/LeftTabMenu/LeftTabMenu";

function FieldTypePage() {
  return (
    <div>
      <LeftTabMenu />
      <div>
        <FieldTypeForm />
      </div>
    </div>
  );
}

export default FieldTypePage;
