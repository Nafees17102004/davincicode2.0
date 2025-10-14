import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./AddTabModal.css";

function AddTabModal({ show, handleClose, newTab, setNewTab, handleCreateTab }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton >
        <Modal.Title>Add Tab</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" placeholder ="Enter Tab name">
            <Form.Label>Tab Name</Form.Label>
            <Form.Control
              value={newTab.name}
              onChange={(e) => setNewTab({ ...newTab, name: e.target.value })}
            /> 
          </Form.Group>
          <Form.Group className="mb-3" placeholder ="Select Tab icon">
            <Form.Label>Tab Icon</Form.Label>
            <Form.Control
              value={newTab.icon}
              onChange={(e) => setNewTab({ ...newTab, icon: e.target.value })}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleCreateTab}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddTabModal;
