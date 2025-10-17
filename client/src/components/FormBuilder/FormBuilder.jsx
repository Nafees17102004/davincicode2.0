import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Table,
} from "react-bootstrap";
import ColumnEditor from "../ColumnEditor/ColumnEditor";
import "./FormBuilder.css";
import projectAPI from "../../api/Api";

export default function FormBuilder() {
  const [idCounter, setIdCounter] = useState(1);
  const [columns, setColumns] = useState([]);
  // Dropdown Bind List
  const [fieldSource, setFieldSource] = useState([]);
  const [fieldSize, setFieldSize] = useState([]);
  const [fieldIcon, setFieldIcon] = useState([]);
  const [fieldOrder, setFieldOrder] = useState([]);
  const [jsVal, setJsVal] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [pageData, setPageData] = useState([]);
  const [iconData, setIconData] = useState([]);

  // Dummy
  const spList = ["sp_get_users", "sp_get_products"];
  const tableList = ["users", "orders"];
  const customList = ["custom_json_1", "custom_json_2"];
  const fieldNames = ["id", "name", "email", "amount"];
  const validationOptions = [
    "required",
    "email",
    "number",
    "minLength",
    "maxLength",
  ];
  const icons = ["fa-user", "fa-database", "fa-table", "fa-cog"];
  const storedProcedures = ["sp_save", "sp_update"];

  const [showTabForm, setShowTabForm] = useState(false);

  // Post Data
  const [tabData, setTabData] = useState({
    tabId: null,
    projectId: 0,
    pageId: 0,
    tabName: "",
    tabImageId: 0,
    createdUser: "",
  });
  const [columnData, setColumnData] = useState({
    tabId: 0,
    fieldSourceId: 0,
    FieldName: "",
    fieldSizeId: 0,
    fieldIconId: 0,
    placeholder: "",
    fieldOrderId: 0,
    cUser: "",
  });
  console.log(columnData.tabId);
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [tabSubmitClicked, setTabSubmitClicked] = useState(false);

  useEffect(() => {
    fetchFieldSrcData();
    fetchFieldSizeData();
    fetchFieldIconData();
    fetchFieldOrderData();
    fetchJsValData();
    fetchProjectData();
    fetchPageData();
    fetchIconData();
    fetchTabData();
  }, []);

  const fetchFieldSrcData = async () => {
    try {
      await projectAPI
        .getLovDropdown("LIST_OF_VALUES_DETAILS", "field_source")
        .then((res) => {
          const formattedData = res.data.result.map((eachSrc) => ({
            id: eachSrc.Id,
            name: eachSrc.Name,
          }));
          setFieldSource(formattedData);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFieldSizeData = async () => {
    try {
      await projectAPI
        .getLovDropdown("LIST_OF_VALUES_DETAILS", "field_size")
        .then((res) => {
          const formattedData = res.data.result.map((eachSize) => ({
            id: eachSize.Id,
            name: eachSize.Name,
          }));
          setFieldSize(formattedData);
        });
    } catch (error) {
      console.error(error);
    }
  };
  const fetchFieldIconData = async () => {
    try {
      await projectAPI
        .getLovDropdown("LIST_OF_VALUES_DETAILS", "field_icon")
        .then((res) => {
          const formattedData = res.data.result.map((eachSize) => ({
            id: eachSize.Id,
            name: eachSize.Name,
          }));
          setFieldIcon(formattedData);
        });
    } catch (error) {
      console.error(error);
    }
  };
  const fetchFieldOrderData = async () => {
    try {
      await projectAPI
        .getLovDropdown("LIST_OF_VALUES_DETAILS", "field_order")
        .then((res) => {
          const formattedData = res.data.result.map((eachSize) => ({
            id: eachSize.Id,
            name: eachSize.Name,
          }));
          setFieldOrder(formattedData);
        });
    } catch (error) {
      console.error(error);
    }
  };
  const fetchJsValData = async () => {
    try {
      await projectAPI.getLovDropdown("JS_VALIDATIONS", null).then((res) => {
        const formattedData = res.data.result.map((eachSize) => ({
          id: eachSize.Id,
          name: eachSize.Name,
        }));
        setJsVal(formattedData);
      });
    } catch (error) {
      console.error(error);
    }
  };
  const fetchProjectData = async () => {
    try {
      await projectAPI.getLovDropdown("PROJECT_TABLE", null).then((res) => {
        const formattedData = res.data.result.map((eachSize) => ({
          id: eachSize.Id,
          name: eachSize.Name,
        }));
        setProjectData(formattedData);
      });
    } catch (error) {
      console.error(error);
    }
  };
  const fetchPageData = async () => {
    try {
      await projectAPI.getLovDropdown("PAGE_TABLE", null).then((res) => {
        const formattedData = res.data.result.map((eachSize) => ({
          id: eachSize.Id,
          name: eachSize.Name,
        }));
        setPageData(formattedData);
      });
    } catch (error) {
      console.error(error);
    }
  };
  const fetchIconData = async () => {
    try {
      await projectAPI.getLovDropdown("TAB_IMAGE_TABLE", null).then((res) => {
        const formattedData = res.data.result.map((eachSize) => ({
          id: eachSize.Id,
          name: eachSize.Name,
        }));
        setIconData(formattedData);
      });
    } catch (error) {
      console.error(error);
    }
  };
  const fetchTabData = async () => {
    try {
      await projectAPI.getLovDropdown("TAB_TABLE", null).then((res) => {
        const formattedData = res.data.result.map((eachSize) => ({
          id: eachSize.Id,
          name: eachSize.Name,
        }));
        setTabs(formattedData);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddTabClick = () => setShowTabForm(true);

  const handleSubmitTab = async () => {
    setTabSubmitClicked(true);
    await projectAPI
      .insertTabDet(tabData)
      .then((res) => {
        const err = res.data.failedTab.map((eachItem) => eachItem.err);
        const successMsg = res.data.message;
        if (err[0]) {
          alert(`Error: ${err}`);
        }
        alert(`Success: ${successMsg}`);
      })
      .catch((error) => {
        console.error(error);
      });
    if (!tabData.tabName.trim()) return;
    const newTab = {
      id: Date.now(),
      tabName: tabData.tabName,
      tabImageId: tabData.tabImageId,
      columns: [],
      submittedColumns: [],
    };
    // await projectAPI.insertLanguage();
    setTabs([...tabs, newTab]);
    setTabData({ tabName: "", tabImageId: "" });
    setShowTabForm(false);
    setTabSubmitClicked(false);
    setActiveTab(tabs.length);
  };

  // const handleRemoveTab = (id) => {
  //   setTabs(tabs.filter((t) => t.id !== id));
  //   setActiveTab(null);
  // };

  const addColumn = () => {
    setColumns([
      ...columns,
      {
        sNo: idCounter,
        tabId: 0,
        fieldSourceId: 0,
        FieldName: "",
        fieldSizeId: 0,
        fieldIconId: 0,
        placeholder: "",
        fieldOrderId: 0,
        cUser: "",
      },
    ]);
    setIdCounter(idCounter + 1);
    // const newCol = {
    //   id: Date.now(),
    //   fieldSource: "",
    //   spName: "",
    //   spParameter: "",
    //   tableName: "",
    //   tableColumn: "",
    //   customName: "",
    //   customText: "",
    //   fieldName: "",
    //   validation: [],
    //   fieldIcon: "",
    //   placeholder: "",
    //   fieldOrder: "",
    //   storedProcedure: "",
    // };
    // const updated = [...tabs];
    // console.log(updated);
    // updated[activeTab].columns.push(newCol);
    // setTabs(updated);
  };
  console.log(columns);
  const handleChange = (index, field, value) => {
    const updatedColumns = [...columns];
    updatedColumns[index][field] = value;
    setColumns(updatedColumns);
  };

  const updateColumn = (index, updates) => {
    const updated = [...tabs];
    updated[activeTab].columns[index] = {
      ...updated[activeTab].columns[index],
      ...updates,
    };
    setTabs(updated);
  };
  const removeColumn = (index) => {
    const updated = [...tabs];
    updated[activeTab].columns.splice(index, 1);
    setTabs(updated);
  };

  const submitColumn = (index) => {
    const updated = [...tabs];
    const col = updated[activeTab].columns[index];
    updated[activeTab].submittedColumns.push(col);
    updated[activeTab].columns.splice(index, 1);
    setTabs(updated);
  };

  // ✅ Move submitted column back to edit
  const backToEdit = (index) => {
    const updated = [...tabs];
    const col = updated[activeTab].submittedColumns[index];
    updated[activeTab].columns.push(col);
    updated[activeTab].submittedColumns.splice(index, 1);
    setTabs(updated);
  };

  // Tab dropdown click
  const handleTabClick = (e) => {
    setTabSubmitClicked(true);
    setColumnData({ ...columnData, tabId: e.target.value });
    if (!tabData.tabName.trim()) return;
    const newTab = {
      id: Date.now(),
      tabName: tabData.tabName,
      tabImageId: tabData.tabImageId,
      columns: [],
      submittedColumns: [],
    };

    // await projectAPI.insertLanguage();
    setTabs([...tabs, newTab]);
    setTabData({ tabName: "", tabImageId: "" });
    setShowTabForm(false);
    setTabSubmitClicked(false);
    setActiveTab(tabs.length);
  };
  return (
    <Container className="py-4">
      {!showTabForm && (
        <Button className="mb-5" variant="primary" onClick={handleAddTabClick}>
          + Add Tab
        </Button>
      )}

      {showTabForm && (
        <Card className="p-3 mb-4 shadow-sm mt-3">
          <Row className="g-3 align-items-end">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Project Name</Form.Label>
                <Form.Select
                  value={tabData.projectId}
                  onChange={(e) =>
                    setTabData({ ...tabData, projectId: e.target.value })
                  }
                >
                  {projectData.map((eachProject) => (
                    <option value={eachProject.id} key={eachProject.id}>
                      {eachProject.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Page Name</Form.Label>
                <Form.Select
                  value={tabData.pageId}
                  onChange={(e) =>
                    setTabData({ ...tabData, pageId: e.target.value })
                  }
                >
                  {pageData.map((eachPage) => (
                    <option value={eachPage.id} key={eachPage.id}>
                      {eachPage.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Tab Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Tab Name"
                  value={tabData.tabName}
                  onChange={(e) =>
                    setTabData({ ...tabData, tabName: e.target.value })
                  }
                />
                {tabSubmitClicked && !tabData.tabName.trim() && (
                  <div style={{ color: "red", fontSize: "0.85rem" }}>
                    * Tab Name is required
                  </div>
                )}
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Tab Icon</Form.Label>
                <Form.Select
                  value={tabData.tabImageId}
                  onChange={(e) =>
                    setTabData({ ...tabData, tabImageId: e.target.value })
                  }
                >
                  {iconData.map((eachIcon) => (
                    <option value={eachIcon.id} key={eachIcon.id}>
                      {eachIcon.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Created User</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Created User"
                  value={tabData.createdUser}
                  onChange={(e) =>
                    setTabData({ ...tabData, createdUser: e.target.value })
                  }
                />
                {tabSubmitClicked && !tabData.createdUser.trim() && (
                  <div style={{ color: "red", fontSize: "0.85rem" }}>
                    * Created User is required
                  </div>
                )}
              </Form.Group>
            </Col>
            <Col md={4}>
              <Button variant="success" onClick={handleSubmitTab}>
                Submit
              </Button>
            </Col>
          </Row>
        </Card>
      )}

      <Row>
        {/* Tabs List */}
        <Col md={3}>
          <Form.Group>
            <Form.Label>Tab Name</Form.Label>
            <Form.Select
              value={columnData.tabId}
              onChange={
                (e) => handleTabClick(e)
                // setTabData({ ...tabData, tabImageId: e.target.value })
              }
            >
              {tabs.map((eachTab) => (
                <option value={eachTab.id} key={eachTab.id}>
                  {eachTab.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          {/* {tabs.slice(1, tabs.length).map((tab, i) => (
            <Card
              key={tab.id}
              className={`p-3 mb-3 shadow-sm ${
                activeTab === i ? "border-primary" : ""
              }`}
              onClick={() => setActiveTab(i)}
              style={{ cursor: "pointer" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <i className={`me-2 ${tab.icon}`}></i>
                  <strong>{tab.name}</strong>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveTab(tab.id);
                  }}
                >
                  Remove
                </Button>
              </div>
            </Card>
          ))} */}
        </Col>

        {/* Active Tab Columns */}
        <Col md={9}>
          <Card className="p-3 mb-3 shadow-sm d-flex flex-column justify-content-between align-items-center">
            <Card className="container-fluid border-0 d-flex flex-row justify-content-between align-items-center">
              <h5 className="m-0">Columns</h5>
              <Button variant="success" size="sm" onClick={addColumn}>
                + Add Column
              </Button>
            </Card>

            <ColumnEditor
              columns={columns}
              onChange={handleChange}
              fieldSource={fieldSource}
              fieldSize={fieldSize}
              fieldOrder={fieldOrder}
              fieldIcon={fieldIcon}
              jsVal={jsVal}
              updateColumn={updateColumn}
              removeColumn={removeColumn}
              submitColumn={submitColumn} // ✅ Pass submit function
              lists={{
                spList,
                tableList,
                customList,
                fieldNames,
                validationOptions,
                icons,
                storedProcedures,
              }}
            />
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
