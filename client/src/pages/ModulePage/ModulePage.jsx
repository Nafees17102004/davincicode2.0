import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import LeftTabMenu from '../../components/LeftTabMenu/LeftTabMenu';
// Corrected import path for the ModuleForm component.
// Please ensure your folder and file names match this path exactly, including capitalization.
import ModuleForm from '../../components/ModuleForm/ModuleForm';

// Assuming your API base URL is configured elsewhere,
// similar to the 'api.jsx' file you provided.
const API_BASE_URL = "http://localhost:5000";

const api = axios.create({
    baseURL: API_BASE_URL,
});

const ModulePage = () => {
    // State to hold the list of projects fetched from the API
    const [projects, setProjects] = useState([]);
    
    // State to manage the dynamic rows of module input fields
    const [modules, setModules] = useState([
        {
            project_id: 0,
            m_name: '',
            m_desc: '',
            inactive_reason: null,
            status: 'active',     // Default value is 'active'
        },
    ]);

    // State for UI feedback
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // useEffect hook to fetch project details when the component mounts
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await api.get('/getProjectDetails');
                setProjects(response.data.projects || response.data);
            } catch (err) {
                setError('Failed to fetch projects. Please check the API endpoint.');
                console.error("Error fetching projects:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    // Handles form submission, sending all module data to the backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitSuccess(false);

        try {
            const response = await api.post('/insertModule', { modules: modules });
            
            if (response.status === 200) {
                // Reset form on successful submission
                setModules([
                    {
                        module_name: '',
                        description: '',
                        inactive_status: null,
                        status: 'active',
                    },
                ]);
                setSubmitSuccess(true);
                setError(null);
            } else {
                setError('Failed to submit modules. Status: ' + response.status);
            }

        } catch (err) {
            setError('An error occurred while submitting modules. Please check the API endpoint.');
            console.error("Error submitting modules:", err);
        }
    };

    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    return (
        <Container className="my-5">
            <LeftTabMenu/>
            <h1 className="text-center mb-4">Module Management</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            {submitSuccess && <Alert variant="success">Modules submitted successfully!</Alert>}
            <Row className="g-4">
                {/* Projects List Box */}
                <Col md={4}>
                    <Card className="shadow">
                        <Card.Header className="bg-primary text-white">
                            <h5>Projects List</h5>
                        </Card.Header>
                        <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {projects.length > 0 ? (
                                <ul className="list-group list-group-flush">
                                    {projects.map((project, index) => (
                                        <li key={index} className="list-group-item">
                                            {project.name}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-center">No projects found.</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Module Form Table */}
                <Col md={8}>
                    <ModuleForm
                        modules={modules}
                        setModules={setModules}
                        handleSubmit={handleSubmit}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default ModulePage;
