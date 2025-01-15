import React, { useState } from 'react';
import api from "../api";

const RecordSearch = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [returnReceipt, setReturnReceipt] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await api.get('/records/search/', {
        params: {
          tracking_number: trackingNumber,
          return_receipt: returnReceipt,
        },
      });
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  return (
    <div>
      <h2>Record Search</h2>
      <input
        type="text"
        placeholder="Tracking Number"
        value={trackingNumber}
        onChange={(e) => setTrackingNumber(e.target.value)}
      />
      <input
        type="text"
        placeholder="Return Receipt"
        value={returnReceipt}
        onChange={(e) => setReturnReceipt(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {results.map((record) => (
          <li key={record.id}>{record.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default RecordSearch;