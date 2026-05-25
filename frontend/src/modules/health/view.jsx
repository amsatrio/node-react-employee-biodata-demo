import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHealthStatus } from './slice';

export default function Health() {
    const dispatch = useDispatch();
    const { data, status, error } = useSelector((state) => state.health);

    useEffect(() => {
        dispatch(fetchHealthStatus());
    }, [dispatch]);

    return (
        <div>
            <h1>Health Page</h1>
            {status === 'loading' && <p>Loading health status...</p>}
            {status === 'failed' && <p style={{ color: 'red' }}>Error: {error}</p>}
            {status === 'succeeded' && data && (
                <div>
                    <p>
                        <strong>Backend Status:</strong> {data.status || 'Unknown'}
                    </p>
                    <p>
                        <strong>Server Time:</strong> {data.timestamp || 'N/A'}
                    </p>
                </div>
            )}
        </div>
    );
}