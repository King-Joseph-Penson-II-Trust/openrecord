import React, { useState, useEffect } from 'react';
import { Collapse, Card, Form, Button, Row, Col } from 'react-bootstrap';
import api from '../api';
import '../styles/DocumentTemplateList.css';

const DocumentTemplateList = () => {
  const [templates, setTemplates] = useState([]);
  const [open, setOpen] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await api.get('/api/templates/');
        setTemplates(response.data);
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };

    fetchTemplates();
  }, []);

  const toggleCollapse = (id) => {
    setOpen((prevOpen) => (prevOpen === id ? null : id));
  };

  const handleInputChange = (templateId, placeholder, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [templateId]: {
        ...prevValues[templateId],
        [placeholder]: value,
      },
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedTemplate) {
      const formData = new FormData();
      formData.append('template_id', selectedTemplate.id);
      formData.append('replacements', JSON.stringify(formValues[selectedTemplate.id]));

      try {
        const response = await api.post('/api/replace_placeholders/', formData);
        console.log('Document generated successfully:', response.data);
      } catch (error) {
        console.error('Error replacing placeholders:', error);
      }
    }
  };

  const handleDelete = async (templateId) => {
    try {
      await api.delete(`/api/templates/delete/${templateId}/`);
      setTemplates(templates.filter(template => template.id !== templateId));
      console.log('Template deleted successfully');
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  return (
    <Row>
      <Col md={4} className="scrollable-column">
        <div className="document-template-list">
          <h2>Available Document Templates</h2>
          <ul>
            {templates.map((template) => (
              <li key={template.id} style={{ listStyleType: 'none', marginBottom: '10px' }}>
                <div
                  onClick={() => toggleCollapse(template.id)}
                  aria-controls={`collapse-${template.id}`}
                  aria-expanded={open === template.id}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: '#f8f9fa',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                  }}
                >
                  {template.name}
                </div>
                <Collapse in={open === template.id}>
                  <div id={`collapse-${template.id}`}>
                    <Card body>
                      <p><strong>ID:</strong> {template.id}</p>
                      <p><strong>Name:</strong> {template.name}</p>
                      <p><strong>Description:</strong> {template.description}</p>
                      <p><strong>File Path:</strong> {template.file_path}</p>
                      <p><strong>Placeholders:</strong></p>
                      <ul>
                        {Array.isArray(template.placeholders) && template.placeholders.map((placeholder, index) => (
                          <li key={index}>{placeholder}</li>
                        ))}
                      </ul>
                      <Button variant="primary" onClick={() => setSelectedTemplate(template)}>
                        Start Drafting
                      </Button>
                      <Button variant="danger" onClick={() => handleDelete(template.id)}>
                        Delete
                      </Button>
                    </Card>
                  </div>
                </Collapse>
              </li>
            ))}
          </ul>
        </div>
      </Col>
      <Col md={8} className={`dynamic-form ${selectedTemplate ? 'show' : 'hide'}`}>
        {selectedTemplate && (
          <div>
            <h2>Create Document from Template: {selectedTemplate.name}</h2>
            <Form onSubmit={handleSubmit}>
              {Array.isArray(selectedTemplate.placeholders) && selectedTemplate.placeholders.map((placeholder, index) => (
                <Form.Group controlId={`form-${selectedTemplate.id}-${index}`} key={index}>
                  <Form.Label>{placeholder}</Form.Label>
                  <Form.Control
                    type="text"
                    value={formValues[selectedTemplate.id]?.[placeholder] || ''}
                    onChange={(e) => handleInputChange(selectedTemplate.id, placeholder, e.target.value)}
                  />
                </Form.Group>
              ))}
              <Button variant="primary" type="submit">
                Create
              </Button>
            </Form>
          </div>
        )}
      </Col>
    </Row>
  );
};

export default DocumentTemplateList;