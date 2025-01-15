import React, { useState } from 'react';
import api from '../api';

const RecordCreation = () => {
  const [formData, setFormData] = useState({
    title: '',
    record_type: '',
    tracking_number: '',
    tracking_type: '',
    return_receipt: '',
    company_name: '',
    state: '',
    zip: '',
    email: '',
    phone_number: '',
    pdf_file_aws: null,
    tracking_mail_receipt_aws: null,
    return_receipt_file_aws: null,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }
      const response = await api.post('/api/records/', formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Record created:', response.data);
      // Optionally, reset the form or redirect the user
      setFormData({
        title: '',
        record_type: '',
        tracking_number: '',
        tracking_type: '',
        return_receipt: '',
        company_name: '',
        state: '',
        zip: '',
        email: '',
        phone_number: '',
        pdf_file_aws: null,
        tracking_mail_receipt_aws: null,
        return_receipt_file_aws: null,
      });
      setErrors({});
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        console.error('Error creating record:', error);
      }
    }
  };

  return (
    <div>
      <h2>Create Record</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
          />
        </label>
        {errors.title && <p>{errors.title}</p>}
        
        <label>
          Record Type:
          <br />
          <br />
          <select
            name="record_type"
            value={formData.record_type}
            onChange={handleChange}
          >
            <option value="">Select Record Type</option>
            <option value="cafv">Conditional-Acceptance-for-Value</option>
            <option value="ipn">International-Promissory-Note</option>
            <option value="boe">International-Bill-of-Exchange</option>
            <option value="noticeBreach">Notice-of-Breach</option>
            <option value="noticeCure">Notice-of-Cure</option>
            <option value="noticeDefault">Notice-of-Default</option>
            <option value="tort">Tort-Claim</option>
            <option value="noticeDemand">Notice-of-Demand</option>
            <option value="noticeDispute">Notice-of-Dispute</option>
            <option value="noticeFraud">Notice-of-Fraud</option>
            <option value="executor">Executor-Letter</option>
            <option value="crn">Copyright-Notice</option>
          </select>
        </label>
        <br />
        <br />
        {errors.record_type && <p>{errors.record_type}</p>}
        
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
          Tracking Type:
          <br />
          <br />
          <select
            name="tracking_type"
            value={formData.tracking_type}
            onChange={handleChange}
          >
            
            <option value="">Select Tracking Type</option>
            <option value="certifiedmail_usps">Certified-Mail-USPS</option>
            <option value="registeredmail_usps">Registered-Mail-USPS</option>
          </select>
        </label>
        {errors.tracking_type && <p>{errors.tracking_type}</p>}
        
        <br />
        <br />
        

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
        
        <label>
          Company Name:
          <input
            type="text"
            name="company_name"
            placeholder="Company Name"
            value={formData.company_name}
            onChange={handleChange}
          />
        </label>
        {errors.company_name && <p>{errors.company_name}</p>}
        
        <label>
          State:
          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
          />
        </label>
        {errors.state && <p>{errors.state}</p>}
        
        <label>
          ZIP Code:
          <input
            type="text"
            name="zip"
            placeholder="ZIP Code"
            value={formData.zip}
            onChange={handleChange}
          />
        </label>
        {errors.zip && <p>{errors.zip}</p>}
        
        <label>
          Email:
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>
        {errors.email && <p>{errors.email}</p>}
        
        <label>
          Phone Number:
          <input
            type="text"
            name="phone_number"
            placeholder="Phone Number"
            value={formData.phone_number}
            onChange={handleChange}
          />
        </label>
        {errors.phone_number && <p>{errors.phone_number}</p>}
        
        <label>
          PDF File:
          <input
            type="file"
            name="pdf_file_aws"
            onChange={handleChange}
          />
        </label>
        {errors.pdf_file_aws && <p>{errors.pdf_file_aws}</p>}
        
        <label>
          Tracking Mail Receipt:
          <input
            type="file"
            name="tracking_mail_receipt_aws"
            onChange={handleChange}
          />
        </label>
        {errors.tracking_mail_receipt_aws && <p>{errors.tracking_mail_receipt_aws}</p>}
        
        <label>
          Return Receipt File:
          <input
            type="file"
            name="return_receipt_file_aws"
            onChange={handleChange}
          />
        </label>
        {errors.return_receipt_file_aws && <p>{errors.return_receipt_file_aws}</p>}
        
        <button type="submit">Create Record</button>
      </form>
    </div>
  );
};

export default RecordCreation;