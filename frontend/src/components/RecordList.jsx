import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RecordList = () => {
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecords, setSelectedRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get('http://localhost:8001/api/records/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setRecords(response.data);
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    };

    fetchRecords();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectRecord = (record) => {
    setSelectedRecords((prevSelected) => [...prevSelected, record]);
  };

  const filteredRecords = records.filter((record) =>
    record.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Record List</h2>
      <input
        type="text"
        placeholder="Search Records"
        value={searchTerm}
        onChange={handleSearch}
      />
      <ul>
        {filteredRecords.map((record) => (
          <li key={record.id}>
            {record.title}
            <button onClick={() => handleSelectRecord(record)}>Select</button>
          </li>
        ))}
      </ul>
      <h3>Selected Records</h3>
      <ul>
        {selectedRecords.map((record) => (
          <li key={record.id}>{record.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default RecordList;