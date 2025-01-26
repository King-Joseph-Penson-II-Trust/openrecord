import React, { useState, useRef } from 'react';
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
    tracking_type: '',
  });

  const [errors, setErrors] = useState({});
  const formRef = useRef(null);

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
      const response = await api.post('/api/records/', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 201) {
        alert('Record created successfully!');
        formRef.current.reset();
        setFormData({
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
          tracking_type: '',
        });
        setErrors({});
      } else {
        setErrors(response.data);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      }
    }
  };

  return (
    <div>
      <Form onSubmit={handleSubmit} ref={formRef}>
        <Row>
          <Col>
            <Form.Group controlId="formTrackingNumber">
              <Form.Label>Tracking Number</Form.Label>
              <Form.Control
                type="text"
                name="tracking_number"
                value={formData.tracking_number}
                onChange={handleChange}
              />
              {errors.tracking_number && <p className="text-danger">{errors.tracking_number}</p>}
            </Form.Group>

            <Form.Group controlId="formReturnReceipt">
              <Form.Label>Return Receipt</Form.Label>
              <Form.Control
                type="text"
                name="return_receipt"
                value={formData.return_receipt}
                onChange={handleChange}
              />
              {errors.return_receipt && <p className="text-danger">{errors.return_receipt}</p>}
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
              {errors.status && <p className="text-danger">{errors.status}</p>}
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
              </Form.Control>
              {errors.record_type && <p className="text-danger">{errors.record_type}</p>}
            </Form.Group>

            <Form.Group controlId="formTrackingType">
              <Form.Label>Tracking Type</Form.Label>
              <Form.Control
                as="select"
                name="tracking_type"
                value={formData.tracking_type}
                onChange={handleChange}
              >
                <option value="">Select Tracking Type</option>
                <option value="certifiedmail_usps">Certified-Mail-USPS</option>
                <option value="registeredmail_usps">Registered-Mail-USPS</option>
              </Form.Control>
              {errors.tracking_type && <p className="text-danger">{errors.tracking_type}</p>}
            </Form.Group>

            <Form.Group controlId="formCompanyName">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
              />
              {errors.company_name && <p className="text-danger">{errors.company_name}</p>}
            </Form.Group>

            <Form.Group controlId="formCeo">
              <Form.Label>CEO</Form.Label>
              <Form.Control
                type="text"
                name="ceo"
                value={formData.ceo}
                onChange={handleChange}
              />
              {errors.ceo && <p className="text-danger">{errors.ceo}</p>}
            </Form.Group>

            <Form.Group controlId="formCfo">
              <Form.Label>CFO</Form.Label>
              <Form.Control
                type="text"
                name="cfo"
                value={formData.cfo}
                onChange={handleChange}
              />
              {errors.cfo && <p className="text-danger">{errors.cfo}</p>}
            </Form.Group>

            <Form.Group controlId="formMailingAddress">
              <Form.Label>Mailing Address</Form.Label>
              <Form.Control
                type="text"
                name="mailing_address"
                value={formData.mailing_address}
                onChange={handleChange}
              />
              {errors.mailing_address && <p className="text-danger">{errors.mailing_address}</p>}
            </Form.Group>

            <Form.Group controlId="formCity">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
              {errors.city && <p className="text-danger">{errors.city}</p>}
            </Form.Group>

            <Form.Group controlId="formState">
              <Form.Label>State</Form.Label>
              <Form.Control
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
              {errors.state && <p className="text-danger">{errors.state}</p>}
            </Form.Group>

            <Form.Group controlId="formZip">
              <Form.Label>ZIP Code</Form.Label>
              <Form.Control
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
              />
              {errors.zip && <p className="text-danger">{errors.zip}</p>}
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="text-danger">{errors.email}</p>}
            </Form.Group>

            <Form.Group controlId="formPhoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
              />
              {errors.phone_number && <p className="text-danger">{errors.phone_number}</p>}
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