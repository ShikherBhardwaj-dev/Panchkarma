
import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, Clock, User, FileText, Eye, Check, X } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext.jsx';
import authFetch from '../../utils/apiClient.js';

const VerificationPanel = ({ user }) => {
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [practitioners, setPractitioners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  const { show } = useToast();

  useEffect(() => {
    fetchVerificationRequests();
    fetchPractitioners();
  }, []);

  const fetchVerificationRequests = async () => {
    try {
      const response = await authFetch('http://localhost:5000/api/verification/requests', {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setVerificationRequests(data.requests);
      }
    } catch (error) {
      console.error('Error fetching verification requests:', error);
    }
  };

  const fetchPractitioners = async () => {
    try {
      const response = await authFetch('http://localhost:5000/api/verification/practitioners', {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPractitioners(data.practitioners);
      }
    } catch (error) {
      console.error('Error fetching practitioners:', error);
    }
  };

  const handleReview = async (practitionerId, action) => {
    setLoading(true);
    try {
      const response = await authFetch(`http://localhost:5000/api/verification/review/${practitionerId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action,
          adminNotes
        })
      });
      if (response.ok) {
        show({
          title: 'Success',
          message: `Verification request ${action}d successfully!`,
          duration: 4000
        });
        setShowModal(false);
        setAdminNotes('');
        fetchVerificationRequests();
        fetchPractitioners();
      } else {
        const errorData = await response.json();
        show({
          title: 'Error',
          message: errorData.message || 'Failed to process request',
          duration: 4000
        });
      }
    } catch (error) {
      show({
        title: 'Error',
        message: 'Failed to process request',
        duration: 4000
      });
    } finally {
      setLoading(false);
    }
  };

  const openModal = (request) => {
    setSelectedRequest(request);
    setAdminNotes(request.verificationRequest?.adminNotes || '');
    setShowModal(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ayurveda-chandana/20 via-ayurveda-haldi/10 to-ayurveda-kumkum/20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-8 mb-6 border border-ayurveda-kumkum/20">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-ayurveda-kumkum to-ayurveda-brahmi rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-display text-dosha-kapha">Verification Management</h1>
              <p className="text-gray-600">Manage practitioner verification requests and status</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Verification Requests */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-ayurveda-kumkum/20">
            <h2 className="text-xl font-display text-dosha-kapha mb-6 flex items-center">
              <Clock className="w-6 h-6 mr-2" />
              Pending Verification Requests
            </h2>
            
            {verificationRequests.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No pending verification requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {verificationRequests.map((request) => (
                  <div key={request._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-gray-500" />
                        <div>
                          <h3 className="font-semibold text-gray-900">{request.name}</h3>
                          <p className="text-sm text-gray-600">{request.email}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.verificationStatus)}`}>
                        {request.verificationStatus}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          License: {request.licenseNumber || 'Not provided'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Submitted: {new Date(request.verificationRequest?.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => openModal(request)}
                        className="flex items-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Review</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* All Practitioners */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-ayurveda-kumkum/20">
            <h2 className="text-xl font-display text-dosha-kapha mb-6 flex items-center">
              <User className="w-6 h-6 mr-2" />
              All Practitioners
            </h2>
            
            <div className="space-y-3">
              {practitioners.map((practitioner) => (
                <div key={practitioner._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-500" />
                      <div>
                        <h3 className="font-semibold text-gray-900">{practitioner.name}</h3>
                        <p className="text-sm text-gray-600">{practitioner.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(practitioner.verificationStatus)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(practitioner.verificationStatus)}`}>
                        {practitioner.verificationStatus}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p>License: {practitioner.licenseNumber || 'Not provided'}</p>
                    <p>Joined: {new Date(practitioner.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Review Modal */}
        {showModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Review Verification Request
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Practitioner Details
                  </label>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p><strong>Name:</strong> {selectedRequest.name}</p>
                    <p><strong>Email:</strong> {selectedRequest.email}</p>
                    <p><strong>License Number:</strong> {selectedRequest.licenseNumber}</p>
                    <p><strong>Submitted:</strong> {new Date(selectedRequest.verificationRequest?.submittedAt).toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Documents
                  </label>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p>{selectedRequest.verificationRequest?.additionalDocuments || 'No additional documents provided'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Notes
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayurveda-kumkum focus:border-ayurveda-kumkum"
                    rows="3"
                    placeholder="Add notes about this verification..."
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => handleReview(selectedRequest._id, 'approve')}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>Approve</span>
                </button>
                <button
                  onClick={() => handleReview(selectedRequest._id, 'reject')}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  <span>Reject</span>
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationPanel;
