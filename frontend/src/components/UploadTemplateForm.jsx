import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import api from '../api';

const UploadTemplateForm = () => {
  const [file, setFile] = useState(null);
  const [scannedPlaceholders, setScannedPlaceholders] = useState([]);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleScanPlaceholders = () => {
    const formData = new FormData();
    formData.append('file', file);

    api.post('/api/templates/scanplaceholders/', formData)
      .then(response => {
        const cleanedPlaceholders = response.data.placeholders.map(ph => ph.replace(/<<|>>/g, ''));
        setScannedPlaceholders(cleanedPlaceholders);
      })
      .catch(error => {
        console.error('Error scanning placeholders:', error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', templateName);
    formData.append('description', templateDescription);
    formData.append('placeholders', JSON.stringify(scannedPlaceholders));

    api.post('/api/templates/upload/', formData)
      .then(response => {
        console.log('Template uploaded:', response.data);
        setShowModal(true);
      })
      .catch(error => {
        setErrors(error.response.data);
        console.error('Error uploading template:', error);
      });
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="templateName">
          <Form.Label>Template Name</Form.Label>
          <Form.Control
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            isInvalid={!!errors.name}
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors.name}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="templateDescription">
          <Form.Label>Template Description</Form.Label>
          <Form.Control
            as="textarea"
            value={templateDescription}
            onChange={(e) => setTemplateDescription(e.target.value)}
            isInvalid={!!errors.description}
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors.description}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="file">
          <Form.Label>Upload Template</Form.Label>
          <Form.Control
            type="file"
            onChange={handleFileChange}
            isInvalid={!!errors.file}
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors.file}
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="button" onClick={handleScanPlaceholders}>
          Scan Placeholders
        </Button>

        {scannedPlaceholders.length > 0 && (
          <div style={{ width: '100%', minHeight: '200px', border: '1px solid #ddd', padding: '8px' }}>
            <h3>Scanned Placeholders:</h3>
            {scannedPlaceholders.map((placeholder, index) => (
              <div
                key={index}
                style={{
                  userSelect: 'none',
                  padding: '16px',
                  margin: '0 0 8px 0',
                  backgroundColor: '#fff',
                  border: '1px solid #ddd'
                }}
              >
                <h5>{placeholder}</h5>
              </div>
            ))}
          </div>
        )}

        <Button variant="primary" type="submit">
          Save Template
        </Button>
      </Form>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Template Uploaded</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>The template has been uploaded successfully.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UploadTemplateForm;