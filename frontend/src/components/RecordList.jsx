import React, { useState, useEffect } from 'react';
import api from '../api';
import { Card, Button, Collapse, Row, Col } from 'react-bootstrap';

const RecordList = () => {
  const [records, setRecords] = useState([]);
  const [open, setOpen] = useState({});
  const [iframeSrc, setIframeSrc] = useState('');

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
              </Card.Header>
              <Collapse in={open[record.id]}>
                <div id={`collapse-${record.id}`}>
                  <Card.Body>
                    <p><strong>Record Type:</strong> {record.record_type}</p>
                    <p><strong>Tracking Type:</strong> {record.tracking_type}</p>
                    <p><strong>Status:</strong> {record.status}</p>
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
                  </Card.Body>
                </div>
              </Collapse>
            </Card>
          ))}
        </Col>
        <Col md={6}>
          <h2>File Viewer</h2>
          {iframeSrc ? (
            <iframe src={iframeSrc} width="100%" height="600px" title="File Viewer"></iframe>
          ) : (
            <p>Select a file to view</p>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default RecordList;