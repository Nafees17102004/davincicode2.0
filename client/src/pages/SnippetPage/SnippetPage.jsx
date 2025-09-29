import React from "react";
import LeftTabMenu from "../../components/LeftTabMenu/LeftTabMenu";
import SnippetForm from "../../components/SnippetForm/SnippetForm";

function SnippetPage() {
  return (
    <div>
      <LeftTabMenu />
      <div>
        <SnippetForm />
      </div>
    </div>
  );
}

export default SnippetPage;
