import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import api from '../api';

const RecordSearch = () => {
  const [formData, setFormData] = useState({
    tracking_number: '',
    return_receipt: '',
  });

  const [results, setResults] = useState([]);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const sanitizeInput = (input) => {
    const pattern = /[^\w\s-]/g; // Allow only alphanumeric characters, spaces, and hyphens
    return input.replace(pattern, '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sanitizedTrackingNumber = sanitizeInput(formData.tracking_number);
    const sanitizedReturnReceipt = sanitizeInput(formData.return_receipt);

    if (!sanitizedTrackingNumber && !sanitizedReturnReceipt) {
      setErrors({ form: 'Please enter a tracking number or return receipt.' });
      return;
    }

    try {
      const response = await api.get('/api/records/search/', {
        params: {
          tracking_number: sanitizedTrackingNumber,
          return_receipt: sanitizedReturnReceipt,
        },
      });
      setResults(response.data);
      setErrors({});
      setShowModal(true); // Show the modal with the search results
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
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
        {errors.form && <p className="text-danger">{errors.form}</p>}
        <Button variant="primary" type="submit">
          Search
        </Button>
      </Form>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Search Results</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {results.length > 0 ? (
            results.map((result) => (
              <div key={result.id}>
                <h5>{result.title}</h5>
                {result.pdf_file_aws && (
                  <>
                    <h6>PDF File</h6>
                    <iframe
                      src={result.pdf_file_aws}
                      title="PDF File"
                      width="100%"
                      height="400px"
                    />
                  </>
                )}
                {result.tracking_mail_receipt_aws && (
                  <>
                    <h6>Tracking Mail Receipt</h6>
                    <iframe
                      src={result.tracking_mail_receipt_aws}
                      title="Tracking Mail Receipt"
                      width="100%"
                      height="400px"
                    />
                  </>
                )}
                {result.return_receipt_file_aws && (
                  <>
                    <h6>Return Receipt File</h6>
                    <iframe
                      src={result.return_receipt_file_aws}
                      title="Return Receipt File"
                      width="100%"
                      height="400px"
                    />
                  </>
                )}
                <hr />
              </div>
            ))
          ) : (
            <p>No results found.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RecordSearch;