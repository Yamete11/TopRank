import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ApprovalRequestItem from '../components/ApprovalRequestItem';
import ApprovalRequestDetails from '../components/ApprovalRequestDetails';

const ApprovalRequestsPage = () => {
  const [approvalRequests, setApprovalRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:8080/approvalrequest', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setApprovalRequests(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const filteredRequests = approvalRequests.filter(request =>
    request.id?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Approval Requests</h1>
      <input
        type="text"
        placeholder="Search by approval request ID"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Approver</th>
            <th>Leave Request</th>
            <th>Request Status</th>
            <th>Comment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.length > 0 ? (
            filteredRequests.map(request => (
              <ApprovalRequestItem
                key={request.id}
                request={request}
                onDetailsClick={() => setSelectedRequest(request)}
              />
            ))
          ) : (
            <tr>
              <td colSpan="6">No approval requests found.</td>
            </tr>
          )}
        </tbody>
      </table>
      {selectedRequest && (
        <ApprovalRequestDetails 
          request={selectedRequest} 
          onClose={() => setSelectedRequest(null)} 
        />
      )}
    </div>
  );
};

export default ApprovalRequestsPage;