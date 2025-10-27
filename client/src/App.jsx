import React from "react";
import { Routes, Route } from "react-router-dom";

import ProjectPage from "./pages/ProjectPage/ProjectPage";
import LanguagePage from "./pages/LanguagePage/LanguagePage";
import ModulePage from "./pages/ModulePage/ModulePage";
import ViewProjectsPage from "./pages/ViewProjectsPage/ViewProjectsPage";
import ViewLanguagePage from "./pages/ViewLanguagePage/ViewLanguagePage";
import AddModulePage from "./pages/ModulePage/AddModulePage";
import FieldTypePage from "./pages/FieldTypePage/FieldTypePage";
// Snippet
import SnippetPage from "./pages/SnippetPage/SnippetPage";
import ViewSnippetPage from "./pages/ViewSnippetPage/ViewSnippetPage";

// Field Page
import ViewFieldPage from "./pages/ViewFieldPage/ViewFieldPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import LovPage from "./pages/LovPage/LovPage";
import ViewLovPage from "./pages/ViewLovPage/ViewLovPage";
import LovDetViewpage from "./pages/LovDetViewpage/LovDetViewpage";
import LovDetpage from "./pages/LovDetpage/LovDetpage";
import DynamicFormPage from "./pages/DynamicFormPage/DynamicFormPage";

function App() {
  return (
    <Routes>
      {/* Main Pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<LanguagePage />} />
      <Route path="/project" element={<ProjectPage />} />
      <Route path="/module/:pCode" element={<ModulePage />} />
      <Route path="/lovDet/:lovId" element={<LovDetViewpage />} />
      <Route path="/lov" element={<LovPage />} />
      <Route path="/field" element={<FieldTypePage />} />
      <Route path="/snippet" element={<SnippetPage />} />
      <Route path="/dynamic-form" element={<DynamicFormPage />} />
      {/* View Page */}
      <Route path="/view-languages" element={<ViewLanguagePage />} />
      <Route path="/view-Projects" element={<ViewProjectsPage />} />
      <Route path="/add-module/:pCode" element={<AddModulePage />} />
      <Route path="/view-field" element={<ViewFieldPage />} />
      <Route path="/view-snippet" element={<ViewSnippetPage />} />
      <Route path="/view-lov" element={<ViewLovPage />} />
      <Route path="/add-lovDet/:lovId" element={<LovDetpage />} />
    </Routes>
  );
}

export default App;
