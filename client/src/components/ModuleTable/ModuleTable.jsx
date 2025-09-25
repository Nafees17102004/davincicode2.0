import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Spinner, Alert } from "react-bootstrap";

const ModuleTable = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("/projects") // ✅ Adjust if endpoint differs
      .then((res) => {
        setProjects(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch projects");
        setLoading(false);
      });
  }, []);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>#</th>
          <th>Project Name</th>
          <th>Description</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((p, i) => (
          <tr key={p.id || i}>
            <td>{i + 1}</td>
            <td>{p.name}</td>
            <td>{p.description}</td>
            <td>{p.status}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ModuleTable;
