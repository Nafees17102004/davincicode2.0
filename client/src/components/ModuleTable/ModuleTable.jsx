import React from 'react';
import { Table, Form } from 'react-bootstrap';

const ModuleTable = ({ modules, onChange }) => {
    return (
        <Table bordered hover>
            <thead>
                <tr className="table-light">
                    <th>Module Name</th>
                    <th>Description</th>
                    <th>Inactive Status</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {modules.map((module, index) => (
                    <tr key={index}>
                        <td>
                            <Form.Control
                                type="text"
                                name="module_name"
                                value={module.module_name}
                                onChange={(e) => onChange(e, index)}
                                required
                            />
                        </td>
                        <td>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={module.description}
                                onChange={(e) => onChange(e, index)}
                                style={{ minHeight: '38px' }}
                            />
                        </td>
                        <td className="text-center align-middle">
                            <Form.Check
                                type="switch"
                                id={`inactive-switch-${index}`}
                                name="inactive_status"
                                checked={module.inactive_status === true}
                                onChange={(e) => onChange(e, index)}
                                className="d-inline-block"
                            />
                        </td>
                        <td>
                            <Form.Select
                                name="status"
                                value={module.status}
                                onChange={(e) => onChange(e, index)}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </Form.Select>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default ModuleTable;
