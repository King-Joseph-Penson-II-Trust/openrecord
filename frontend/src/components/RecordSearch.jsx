import React, { useState } from 'react';
import api from '../api';

const RecordSearch = () => {
  const [formData, setFormData] = useState({
    tracking_number: '',
    return_receipt: '',
  });

  const [results, setResults] = useState([]);
  const [errors, setErrors] = useState({});

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
      const response = await api.get('/api/records/search/', {
        params: {
          tracking_number: formData.tracking_number,
          return_receipt: formData.return_receipt,
        },
      });
      setResults(response.data);
      setErrors({});
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
        alert('Error searching records: ' + error.response.data.detail);
      } else {
        console.error('Error searching records:', error);
        alert('Error searching records');
      }
    }
  };

  return (
    <div>
      <h2>Search Records</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Tracking Number:
          <input
            type="text"
            name="tracking_number"
            placeholder="Tracking Number"
            value={formData.tracking_number}
            onChange={handleChange}
          />
        </label>
        {errors.tracking_number && <p>{errors.tracking_number}</p>}
        
        <label>
          Return Receipt:
          <input
            type="text"
            name="return_receipt"
            placeholder="Return Receipt"
            value={formData.return_receipt}
            onChange={handleChange}
          />
        </label>
        {errors.return_receipt && <p>{errors.return_receipt}</p>}
        
        <button type="submit">Search</button>
      </form>
      
      <h3>Search Results</h3>
      <ul>
        {results.map((record) => (
          <li key={record.id}>
            <h4>{record.title}</h4>
            <iframe src={record.pdf_file_aws} title="PDF File" width="300" height="200"></iframe>
            <iframe src={record.tracking_mail_receipt_aws} title="Tracking Mail Receipt" width="300" height="200"></iframe>
            <iframe src={record.return_receipt_file_aws} title="Return Receipt File" width="300" height="200"></iframe>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecordSearch;