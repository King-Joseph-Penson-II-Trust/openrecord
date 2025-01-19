import React, { useState, useEffect } from 'react';
import api from '../api';
import { Card, Button, Collapse, Row, Col, Form } from 'react-bootstrap';

const RecordList = () => {
  const [records, setRecords] = useState([]);
  const [open, setOpen] = useState({});
  const [iframeSrc, setIframeSrc] = useState('');
  const [editingRecordId, setEditingRecordId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [fileData, setFileData] = useState({
    pdf_file_aws: null,
    tracking_mail_receipt_aws: null,
    return_receipt_file_aws: null,
  });

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await api.get('/api/records/list/');
        setRecords(response.data);
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    };

    fetchRecords();
  }, []);

  const toggleCollapse = (id) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [id]: !prevOpen[id],
    }));
  };

  const handleViewFile = (url) => {
    setIframeSrc(url);
  };

  const handleEditClick = (record) => {
    if (editingRecordId === record.id) {
      setEditingRecordId(null);
      setEditFormData({});
    } else {
      setEditingRecordId(record.id);
      setEditFormData(record);
      setOpen((prevOpen) => ({
        ...prevOpen,
        [record.id]: true,
      }));
    }
  };

  const handleCancelEdit = () => {
    setEditingRecordId(null);
    setEditFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFileData({
      ...fileData,
      [name]: files[0],
    });
  };

  const handleSaveEdit = async () => {
    try {
      const response = await api.put(`/api/records/${editingRecordId}/`, editFormData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setRecords((prevRecords) =>
        prevRecords.map((record) =>
          record.id === editingRecordId ? response.data : record
        )
      );
      setEditingRecordId(null);
      setEditFormData({});
    } catch (error) {
      console.error('Error saving record:', error);
    }
  };

  const handleFileUpload = async (fieldName) => {
    const formData = new FormData();
    formData.append(fieldName, fileData[fieldName]);

    try {
      const response = await api.patch(`/api/records/${editingRecordId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setRecords((prevRecords) =>
        prevRecords.map((record) =>
          record.id === editingRecordId ? response.data : record
        )
      );
      setFileData({
        pdf_file_aws: null,
        tracking_mail_receipt_aws: null,
        return_receipt_file_aws: null,
      });
    } catch (error) {
      console.error(`Error uploading ${fieldName}:`, error);
    }
  };

  return (
    <div className="container mt-4">
      <Row>
        <Col md={6}>
          <h2>Record List</h2>
          {records.map((record) => (
            <Card key={record.id} className="mb-3">
              <Card.Header>
                <Button
                  variant="link"
                  onClick={() => toggleCollapse(record.id)}
                  aria-controls={`collapse-${record.id}`}
                  aria-expanded={open[record.id]}
                >
                  {record.title || 'No Title'}
                </Button>
                <Button
                  variant="outline-primary"
                  className="ml-2"
                  onClick={() => handleEditClick(record)}
                >
                  {editingRecordId === record.id ? 'Close' : 'Edit'}
                </Button>
              </Card.Header>
              <Collapse in={open[record.id]}>
                <div id={`collapse-${record.id}`}>
                  {editingRecordId === record.id ? (
                    <Form>
                      <Form.Group controlId="formTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                          type="text"
                          name="title"
                          value={editFormData.title}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <Form.Group controlId="formTrackingNumber">
                        <Form.Label>Tracking Number</Form.Label>
                        <Form.Control
                          type="text"
                          name="tracking_number"
                          value={editFormData.tracking_number}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <Form.Group controlId="formReturnReceipt">
                        <Form.Label>Return Receipt</Form.Label>
                        <Form.Control
                          type="text"
                          name="return_receipt"
                          value={editFormData.return_receipt}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <Form.Group controlId="formRecordType">
                        <Form.Label>Record Type</Form.Label>
                        <Form.Control
                          type="text"
                          name="record_type"
                          value={editFormData.record_type}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <Form.Group controlId="formTrackingType">
                        <Form.Label>Tracking Type</Form.Label>
                        <Form.Control
                          type="text"
                          name="tracking_type"
                          value={editFormData.tracking_type}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <Form.Group controlId="formStatus">
                        <Form.Label>Status</Form.Label>
                        <Form.Control
                          as="select"
                          name="status"
                          value={editFormData.status}
                          onChange={handleInputChange}
                        >
                          <option value="pending">Pending</option>
                          <option value="delivered">Delivered</option>
                          <option value="confirmation">Confirmation</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId="formCompanyName">
                        <Form.Label>Company Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="company_name"
                          value={editFormData.company_name}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <Form.Group controlId="formCeo">
                        <Form.Label>CEO</Form.Label>
                        <Form.Control
                          type="text"
                          name="ceo"
                          value={editFormData.ceo}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <Form.Group controlId="formCfo">
                        <Form.Label>CFO</Form.Label>
                        <Form.Control
                          type="text"
                          name="cfo"
                          value={editFormData.cfo}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <Form.Group controlId="formMailingAddress">
                        <Form.Label>Mailing Address</Form.Label>
                        <Form.Control
                          type="text"
                          name="mailing_address"
                          value={editFormData.mailing_address}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <Form.Group controlId="formCity">
                        <Form.Label>City</Form.Label>
                        <Form.Control
                          type="text"
                          name="city"
                          value={editFormData.city}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <Form.Group controlId="formState">
                        <Form.Label>State</Form.Label>
                        <Form.Control
                          type="text"
                          name="state"
                          value={editFormData.state}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <Form.Group controlId="formZip">
                        <Form.Label>ZIP Code</Form.Label>
                        <Form.Control
                          type="text"
                          name="zip"
                          value={editFormData.zip}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <Form.Group controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={editFormData.email}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <Form.Group controlId="formPhoneNumber">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          type="text"
                          name="phone_number"
                          value={editFormData.phone_number}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <Form.Group controlId="formPdfFile">
                        <Form.Label>PDF File</Form.Label>
                        <Form.Control
                          type="file"
                          name="pdf_file_aws"
                          onChange={handleFileChange}
                        />
                        <Button variant="primary" onClick={() => handleFileUpload('pdf_file_aws')}>
                          Upload PDF
                        </Button>
                      </Form.Group>
                      <Form.Group controlId="formTrackingMailReceipt">
                        <Form.Label>Tracking Mail Receipt</Form.Label>
                        <Form.Control
                          type="file"
                          name="tracking_mail_receipt_aws"
                          onChange={handleFileChange}
                        />
                        <Button variant="primary" onClick={() => handleFileUpload('tracking_mail_receipt_aws')}>
                          Upload Tracking Mail Receipt
                        </Button>
                      </Form.Group>
                      <Form.Group controlId="formReturnReceiptFile">
                        <Form.Label>Return Receipt File</Form.Label>
                        <Form.Control
                          type="file"
                          name="return_receipt_file_aws"
                          onChange={handleFileChange}
                        />
                        <Button variant="primary" onClick={() => handleFileUpload('return_receipt_file_aws')}>
                          Upload Return Receipt
                        </Button>
                      </Form.Group>
                      <Button variant="primary" onClick={handleSaveEdit}>
                        Save
                      </Button>
                      <Button variant="secondary" onClick={handleCancelEdit} className="ml-2">
                        Cancel
                      </Button>
                    </Form>
                  ) : (
                    <div>
                      <p><strong>Tracking Number:</strong> {record.tracking_number}</p>
                      <p><strong>Status:</strong> {record.status}</p>
                      <p><strong>Record Type:</strong> {record.record_type}</p>
                      <p><strong>Tracking Type:</strong> {record.tracking_type}</p>
                      <p><strong>Company Name:</strong> {record.company_name}</p>
                      <p><strong>CEO:</strong> {record.ceo}</p>
                      <p><strong>CFO:</strong> {record.cfo}</p>
                      <p><strong>Mailing Address:</strong> {record.mailing_address}</p>
                      <p><strong>City:</strong> {record.city}</p>
                      <p><strong>State:</strong> {record.state}</p>
                      <p><strong>ZIP Code:</strong> {record.zip}</p>
                      <p><strong>Email:</strong> {record.email}</p>
                      <p><strong>Phone Number:</strong> {record.phone_number}</p>
                      <p><strong>Created By:</strong> {record.created_by}</p>
                      <p><strong>Created At:</strong> {record.created_at}</p>
                      <p><strong>Updated At:</strong> {record.updated_at}</p>
                      <p><strong>PDF File:</strong> <Button variant="link" onClick={() => handleViewFile(record.pdf_file_aws)}>View PDF</Button></p>
                      <p><strong>Tracking Mail Receipt:</strong> <Button variant="link" onClick={() => handleViewFile(record.tracking_mail_receipt_aws)}>View Receipt</Button></p>
                      <p><strong>Return Receipt File:</strong> <Button variant="link" onClick={() => handleViewFile(record.return_receipt_file_aws)}>View Return Receipt</Button></p>
                      <p><strong>Hash:</strong> {record.hash}</p>
                    </div>
                  )}
                </div>
              </Collapse>
            </Card>
          ))}
        </Col>
        <Col md={6}>
          {iframeSrc && (
            <iframe
              src={iframeSrc}
              title="Document Viewer"
              width="100%"
              height="600px"
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default RecordList;