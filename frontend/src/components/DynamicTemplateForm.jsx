import React, { useState } from 'react';
import api from '../api';

const DynamicForm = ({ template, placeholders }) => {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/templates/scanplaceholders/', {
        template: template.file,
        data: formData,
      });
      alert('Document created successfully!');
    } catch (error) {
      console.error('Error creating document:', error);
      alert('Error creating document');
    }
  };

  return (
    <div>
      <h2>Create Document from Template: {template.name}</h2>
      <form onSubmit={handleSubmit}>
        {placeholders.map((placeholder) => (
          <div key={placeholder}>
            <label>{placeholder}</label>
            <input
              type="text"
              name={placeholder}
              value={formData[placeholder] || ''}
              onChange={handleChange}
            />
          </div>
        ))}
        <button type="submit">Create Document</button>
      </form>
    </div>
  );
};

export default DynamicForm;