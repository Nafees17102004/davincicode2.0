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
                                name="m_name"
                                value={module.m_name}
                                onChange={(e) => onChange(index, m_name,e.target.value)}
                                required
                            />
                        </td>
                        <td>
                            <Form.Control
                                as="textarea"
                                name="m_desc"
                                value={module.m_desc}
                                onChange={(e) => onChange(index, m_desc,e.target.value)}
                                style={{ minHeight: '38px' }}
                            />
                        </td>
                        <td className="text-center align-middle">
                            <Form.Check
                                type="switch"
                                id={`inactive-switch-${index}`}
                                name="status"
                                checked={module.status === active}
                                onChange={(e) => onChange(index, status,e.target.value)}
                                className="d-inline-block"
                            />
                        </td>
                        <td>
                            <Form.Select
                                name="status"
                                value={module.status}
                                onChange={(e) => onChange(index, m_name,e.target.value)}
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
