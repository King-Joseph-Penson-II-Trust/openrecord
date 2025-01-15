import React, { useState } from 'react';
import api from "../api";

const RecordCreation = () => {
  const [formData, setFormData] = useState({
    title: '',
    tracking_number: '',
    return_receipt: '',
    company_name: '',
    // Add other fields as needed
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/records/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Record created:', response.data);
      // Optionally, reset the form or redirect the user
      setFormData({
        title: '',
        tracking_number: '',
        return_receipt: '',
        company_name: '',
        // Reset other fields as needed
      });
    } catch (error) {
      console.error('Error creating record:', error);
    }
  };

  return (
    <div>
      <h2>Create Record</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
        />
        <input
          type="text"
          name="tracking_number"
          placeholder="Tracking Number"
          value={formData.tracking_number}
          onChange={handleChange}
        />
        <input
          type="text"
          name="return_receipt"
          placeholder="Return Receipt"
          value={formData.return_receipt}
          onChange={handleChange}
        />
        <input
          type="text"
          name="company_name"
          placeholder="Company Name"
          value={formData.company_name}
          onChange={handleChange}
        />
        {/* Add other fields as needed */}
        <button type="submit">Create Record</button>
      </form>
    </div>
  );
};

export default RecordCreation;