import React from "react";
import { Routes, Route } from "react-router-dom";

import ProjectPage from "./pages/ProjectPage/ProjectPage";
import LanguagePage from "./pages/LanguagePage/LanguagePage";
import ModulePage from "./pages/ModulePage/ModulePage";
import ViewProjectsPage from "./pages/ViewProjectsPage/ViewProjectsPage";
import ViewLanguagePage from "./pages/ViewLanguagePage/ViewLanguagePage";
import AddModulePage from "./pages/ModulePage/AddModulePage";
import FieldTypePage from "./pages/FieldTypePage/FieldTypePage";
import SnippetPage from "./pages/SnippetPage/SnippetPage";
import ViewFieldPage from "./pages/ViewFieldPage/ViewFieldPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import LovPage from "./pages/LovPage/LovPage";
import LovDetPage from "./pages/LovDetPage/LovDetPage";

function App() {
  return (
    <Routes>
      {/* Main Pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<LanguagePage />} />
      <Route path="/project" element={<ProjectPage />} />
      <Route path="/module/:pCode" element={<ModulePage />} />
      <Route path="/lov" element={<LovPage />} />
      <Route path="/lovDet" element={<LovDetPage />} />
      <Route path="/field" element={<FieldTypePage />} />
      <Route path="/snippet" element={<SnippetPage />} />
      {/* View Page */}
      <Route path="/view-languages" element={<ViewLanguagePage />} />
      <Route path="/view-Projects" element={<ViewProjectsPage />} />
      <Route path="/add-module/:pCode" element={<AddModulePage />} />
      <Route path="/view-field" element={<ViewFieldPage />} />
    </Routes>
  );
}

export default App;
