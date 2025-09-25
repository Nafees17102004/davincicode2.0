import React from 'react';
import { Card, Form, Button } from 'react-bootstrap';
// This path appears to be correct based on the folder structure you provided.
// I am re-providing the code as is to ensure there are no other issues.
import ModuleTable from '../ModuleTable/ModuleTable';

const ModuleForm = ({ modules, setModules, handleSubmit }) => {
    // Handles changes in the input fields for each module row
    const handleInputChange = (e, index) => {
        const { name, value, type, checked } = e.target;
        const list = [...modules];
        if (type === 'checkbox') {
            list[index][name] = checked ? true : null;
        } else {
            list[index][name] = value;
        }
        setModules(list);
    };
    
    // Adds a new empty row to the modules state
    const handleAddModule = () => {
        setModules([
            ...modules,
            {
                module_name: '',
                description: '',
                inactive_status: null,
                status: 'active',
            },
        ]);
    };
    
    return (
        <Card className="shadow">
            <Card.Header className="bg-secondary text-white">
                <h5>Add New Modules</h5>
            </Card.Header>
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                    <div className="table-responsive">
                        <ModuleTable modules={modules} onChange={handleInputChange} />
                    </div>
                    <div className="d-flex justify-content-between mt-3">
                        <Button variant="outline-primary" onClick={handleAddModule}>
                            Add More
                        </Button>
                        <Button variant="success" type="submit">
                            Submit All Modules
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default ModuleForm;
