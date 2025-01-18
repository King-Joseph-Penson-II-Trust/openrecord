import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import api from '../api';

const NewRecord = () => {
  const [formData, setFormData] = useState({
    tracking_number: '',
    return_receipt: '',
    status: '',
    record_type: '',
    company_name: '',
    ceo: '',
    cfo: '',
    mailing_address: '',
    city: '',
    state: '',
    zip: '',
    email: '',
    phone_number: '',
    pdf_file: null,
    tracking_mail_receipt: null,
    return_receipt_file: null,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    for (const key in formData) {
      form.append(key, formData[key]);
    }
    try {
      const response = await api.post('/api/records/', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Record created:', response.data);
    } catch (error) {
      console.error('Error creating record:', error);
      setErrors(error.response.data);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create New Record</h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group controlId="formTrackingNumber">
              <Form.Label>Tracking Number</Form.Label>
              <Form.Control
                type="text"
                name="tracking_number"
                placeholder="Tracking Number"
                value={formData.tracking_number}
                onChange={handleChange}
              />
              {errors.tracking_number && <p>{errors.tracking_number}</p>}
            </Form.Group>

            <Form.Group controlId="formReturnReceipt">
              <Form.Label>Return Receipt</Form.Label>
              <Form.Control
                type="text"
                name="return_receipt"
                placeholder="Return Receipt"
                value={formData.return_receipt}
                onChange={handleChange}
              />
              {errors.return_receipt && <p>{errors.return_receipt}</p>}
            </Form.Group>

            <Form.Group controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="">Select Status</option>
                <option value="pending">Pending</option>
                <option value="delivered">Delivered</option>
                <option value="confirmation">Confirmation</option>
              </Form.Control>
              {errors.status && <p>{errors.status}</p>}
            </Form.Group>

            <Form.Group controlId="formRecordType">
              <Form.Label>Record Type</Form.Label>
              <Form.Control
                as="select"
                name="record_type"
                value={formData.record_type}
                onChange={handleChange}
              >
                <option value="">Select Record Type</option>
                <option value="cafv">Conditional Acceptance for Value</option>
                <option value="ipn">International Promissory Note</option>
                <option value="boe">International Bill of Exchange</option>
                <option value="noticeBreach">Notice of Breach</option>
                <option value="noticeCure">Notice of Cure</option>
                <option value="noticeDefault">Notice of Default</option>
                <option value="tort">Tort Claim</option>
                <option value="noticeDemand">Notice of Demand</option>
                <option value="noticeDispute">Notice of Dispute</option>
                <option value="noticeFraud">Notice of Fraud</option>
                <option value="executor">Executor Letter</option>
                <option value="crn">Copyright Notice</option>
              </Form.Control>
              {errors.record_type && <p>{errors.record_type}</p>}
            </Form.Group>

            <Form.Group controlId="formCompanyName">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                type="text"
                name="company_name"
                placeholder="Company Name"
                value={formData.company_name}
                onChange={handleChange}
              />
              {errors.company_name && <p>{errors.company_name}</p>}
            </Form.Group>

            <Form.Group controlId="formCeo">
              <Form.Label>CEO</Form.Label>
              <Form.Control
                type="text"
                name="ceo"
                placeholder="CEO"
                value={formData.ceo}
                onChange={handleChange}
              />
              {errors.ceo && <p>{errors.ceo}</p>}
            </Form.Group>

            <Form.Group controlId="formCfo">
              <Form.Label>CFO</Form.Label>
              <Form.Control
                type="text"
                name="cfo"
                placeholder="CFO"
                value={formData.cfo}
                onChange={handleChange}
              />
              {errors.cfo && <p>{errors.cfo}</p>}
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="formMailingAddress">
              <Form.Label>Mailing Address</Form.Label>
              <Form.Control
                type="text"
                name="mailing_address"
                placeholder="Mailing Address"
                value={formData.mailing_address}
                onChange={handleChange}
              />
              {errors.mailing_address && <p>{errors.mailing_address}</p>}
            </Form.Group>

            <Form.Group controlId="formCity">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
              />
              {errors.city && <p>{errors.city}</p>}
            </Form.Group>

            <Form.Group controlId="formState">
              <Form.Label>State</Form.Label>
              <Form.Control
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
              />
              {errors.state && <p>{errors.state}</p>}
            </Form.Group>

            <Form.Group controlId="formZip">
              <Form.Label>ZIP Code</Form.Label>
              <Form.Control
                type="text"
                name="zip"
                placeholder="ZIP Code"
                value={formData.zip}
                onChange={handleChange}
              />
              {errors.zip && <p>{errors.zip}</p>}
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p>{errors.email}</p>}
            </Form.Group>

            <Form.Group controlId="formPhoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phone_number"
                placeholder="Phone Number"
                value={formData.phone_number}
                onChange={handleChange}
              />
              {errors.phone_number && <p>{errors.phone_number}</p>}
            </Form.Group>

            <Form.Group controlId="formPdfFile">
              <Form.Label>PDF File</Form.Label>
              <Form.Control
                type="file"
                name="pdf_file"
                onChange={handleFileChange}
              />
              {errors.pdf_file && <p>{errors.pdf_file}</p>}
            </Form.Group>

            <Form.Group controlId="formTrackingMailReceipt">
              <Form.Label>Tracking Mail Receipt</Form.Label>
              <Form.Control
                type="file"
                name="tracking_mail_receipt"
                onChange={handleFileChange}
              />
              {errors.tracking_mail_receipt && <p>{errors.tracking_mail_receipt}</p>}
            </Form.Group>

            <Form.Group controlId="formReturnReceiptFile">
              <Form.Label>Return Receipt File</Form.Label>
              <Form.Control
                type="file"
                name="return_receipt_file"
                onChange={handleFileChange}
              />
              {errors.return_receipt_file && <p>{errors.return_receipt_file}</p>}
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" type="submit">
          Create Record
        </Button>
      </Form>
    </div>
  );
};

export default NewRecord;