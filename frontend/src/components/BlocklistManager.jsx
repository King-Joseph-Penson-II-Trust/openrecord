import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BlocklistView = () => {
    const [blocklist, setBlocklist] = useState([]);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        const fetchBlocklist = async () => {
            try {
                const response = await axios.get('http://192.168.1.13:8005/api/blocklist/');
                setBlocklist(response.data.blocklist);
            } catch (error) {
                console.error('Error fetching blocklist:', error);
            }
        };
        fetchBlocklist();
    }, []);

    const addToBlocklist = async () => {
        if (!inputValue) return; // Prevent adding empty items
        try {
            const response = await axios.post('http://192.168.1.13:8005/api/blocklist/', { ip_or_domain: inputValue });
            setBlocklist([...blocklist, response.data.ip_or_domain]);
            setInputValue(''); // Clear input after adding
        } catch (error) {
            console.error('Error adding to blocklist:', error);
        }
    };

    const filteredBlocklist = inputValue
        ? blocklist.filter(item => item.toLowerCase().includes(inputValue.toLowerCase()))
        : blocklist;

    return (
        <div>
            <input
                type="text"
                placeholder="Search or add new item..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
            <button onClick={addToBlocklist}>Add to Blocklist</button>
            <ul>
                {filteredBlocklist.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    );
};

export default BlocklistView;