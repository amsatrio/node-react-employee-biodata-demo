import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ListBiodataView() {
  const [biodatas, setBiodatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllBiodatas = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login'); // Redirect to login if no token
        return;
      }

      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        if (tokenPayload.role !== 0) {
          setError("You do not have administrative access.");
          setLoading(false);
          return;
        }

        const response = await fetch('/v1/biodatas', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 403) {
          const errData = await response.json();
          setError(errData.message || "Access denied.");
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setBiodatas(data);
      } catch (err) {
        console.error("Error fetching all biodatas:", err);
        setError(err.message || "Failed to fetch biodata list.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllBiodatas();
  }, [navigate]);

  if (loading) {
    return <p>Loading biodata list...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Biodata List</h1>
      {biodatas.length === 0 ? (
        <p>No biodata entries found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <th style={{ padding: '8px', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Position</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Phone Number</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {biodatas.map((bio) => (
              <tr key={bio.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px' }}>{bio.id}</td>
                <td style={{ padding: '8px' }}>{bio.name}</td>
                <td style={{ padding: '8px' }}>{bio.position}</td>
                <td style={{ padding: '8px' }}>{bio.email}</td>
                <td style={{ padding: '8px' }}>{bio.phone_number}</td>
                <td style={{ padding: '8px' }}>
                  <button onClick={() => navigate(`/biodata-detail/${bio.id}`)}>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}