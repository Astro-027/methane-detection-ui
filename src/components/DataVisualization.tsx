import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DataVisualization = ({ filePath = '/data/scaled/NewUpdatedSimulatedData.txt' }) => {
    const [dataContent, setDataContent] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(filePath);
                const text = await response.text();
                setDataContent(text);
            } catch (error) {
                console.error('Failed to fetch data:', error);
                setDataContent('Failed to load data.');
            }
        };

        fetchData();
    }, [filePath]);

    return (
        <div style={{ whiteSpace: 'pre', fontFamily: 'monospace', margin: '20px' }}>
            <div>
                <Link to="/">
                    <button>Back to Main</button>
                </Link>
            </div>
            {dataContent}
        </div>
    );
};

export default DataVisualization;
