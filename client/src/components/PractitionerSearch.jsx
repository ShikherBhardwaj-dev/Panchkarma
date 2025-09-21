import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Clock, DollarSign, User, CheckCircle, XCircle, Phone, Mail } from 'lucide-react';
import { useToast } from '../contexts/ToastContext.jsx';

const PractitionerSearch = ({ user, onAssignmentSuccess }) => {
  const [searchParams, setSearchParams] = useState({
    city: '',
    state: '',
    pincode: '',
    practiceArea: ''
  });
  const [practitioners, setPractitioners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPractitioner, setSelectedPractitioner] = useState(null);
  const [assignedPractitioner, setAssignedPractitioner] = useState(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const { show } = useToast();

  // Available practice areas
  const practiceAreas = [
    'Vamana (Therapeutic Vomiting)',
    'Virechana (Purgation Therapy)',
    'Basti (Medicated Enema)',
    'Nasya (Nasal Administration)',
    'Raktamoksha (Bloodletting)',
    'General Consultation',
    'Wellness Counseling'
  ];

  useEffect(() => {
    if (user?.userType === 'patient') {
      fetchAssignedPractitioner();
    }
  }, [user]);

  const fetchAssignedPractitioner = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/practitioner-search/assigned/current', {
        headers: {
          'x-auth-token': token
        }
      });
      const data = await response.json();
      
      if (data.success && data.assigned) {
        setAssignedPractitioner(data.practitioner);
      }
    } catch (error) {
      console.error('Error fetching assigned practitioner:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchParams.city && !searchParams.state && !searchParams.pincode) {
      show({
        title: 'Search Required',
        message: 'Please enter at least a city, state, or pincode to search',
        duration: 4000
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();
      
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await fetch(`http://localhost:5000/api/practitioner-search/search?${queryParams}`, {
        headers: {
          'x-auth-token': token
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPractitioners(data.practitioners);
        if (data.practitioners.length === 0) {
          show({
            title: 'No Results',
            message: 'No practitioners found matching your criteria',
            duration: 4000
          });
        }
      } else {
        show({
          title: 'Search Error',
          message: data.message || 'Failed to search practitioners',
          duration: 4000
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      show({
        title: 'Search Error',
        message: 'Failed to search practitioners',
        duration: 4000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAssignPractitioner = async (practitioner) => {
    setSelectedPractitioner(practitioner);
    setShowAssignmentModal(true);
  };

  const confirmAssignment = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/practitioner-search/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          practitionerId: selectedPractitioner._id
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        show({
          title: 'Success',
          message: `Successfully assigned to Dr. ${selectedPractitioner.name}`,
          duration: 4000
        });
        setAssignedPractitioner(selectedPractitioner);
        setShowAssignmentModal(false);
        setSelectedPractitioner(null);
        if (onAssignmentSuccess) {
          onAssignmentSuccess(selectedPractitioner);
        }
      } else {
        show({
          title: 'Assignment Failed',
          message: data.message || 'Failed to assign practitioner',
          duration: 4000
        });
      }
    } catch (error) {
      console.error('Assignment error:', error);
      show({
        title: 'Assignment Error',
        message: 'Failed to assign practitioner',
        duration: 4000
      });
    }
  };

  const handleRemoveAssignment = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/practitioner-search/assigned', {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        show({
          title: 'Success',
          message: 'Practitioner assignment removed',
          duration: 4000
        });
        setAssignedPractitioner(null);
      } else {
        show({
          title: 'Error',
          message: data.message || 'Failed to remove assignment',
          duration: 4000
        });
      }
    } catch (error) {
      console.error('Remove assignment error:', error);
      show({
        title: 'Error',
        message: 'Failed to remove assignment',
        duration: 4000
      });
    }
  };

  if (user?.userType !== 'patient') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ayurveda-chandana/20 via-ayurveda-haldi/10 to-ayurveda-kumkum/20 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-ayurveda-kumkum/20">
            <h1 className="text-3xl font-display text-dosha-kapha mb-4">Practitioner Search</h1>
            <p className="text-gray-600">This feature is only available for patients.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ayurveda-chandana/20 via-ayurveda-haldi/10 to-ayurveda-kumkum/20 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-ayurveda-kumkum/20 mb-6">
          <h1 className="text-3xl font-display text-dosha-kapha mb-4">Find Your Practitioner</h1>
          <p className="text-gray-600 mb-6">Search for verified practitioners in your area and get assigned to the one that suits you best.</p>
          
          {/* Current Assignment */}
          {assignedPractitioner && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <div>
                    <h3 className="font-semibold text-green-800">Currently Assigned</h3>
                    <p className="text-green-700">Dr. {assignedPractitioner.name}</p>
                    <p className="text-sm text-green-600">{assignedPractitioner.practiceLocation?.city}, {assignedPractitioner.practiceLocation?.state}</p>
                  </div>
                </div>
                <button
                  onClick={handleRemoveAssignment}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Remove Assignment
                </button>
              </div>
            </div>
          )}

          {/* Search Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                value={searchParams.city}
                onChange={(e) => setSearchParams({...searchParams, city: e.target.value})}
                placeholder="Enter city"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <input
                type="text"
                value={searchParams.state}
                onChange={(e) => setSearchParams({...searchParams, state: e.target.value})}
                placeholder="Enter state"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
              <input
                type="text"
                value={searchParams.pincode}
                onChange={(e) => setSearchParams({...searchParams, pincode: e.target.value})}
                placeholder="Enter pincode"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Practice Area</label>
              <select
                value={searchParams.practiceArea}
                onChange={(e) => setSearchParams({...searchParams, practiceArea: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Areas</option>
                {practiceAreas.map((area) => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>
          </div>
          
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            <Search className="h-5 w-5 mr-2" />
            {loading ? 'Searching...' : 'Search Practitioners'}
          </button>
        </div>

        {/* Search Results */}
        {practitioners.length > 0 && (
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-ayurveda-kumkum/20">
            <h2 className="text-2xl font-display text-dosha-kapha mb-6">Available Practitioners ({practitioners.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {practitioners.map((practitioner) => (
                <div key={practitioner._id} className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                        <User className="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Dr. {practitioner.name}</h3>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          {practitioner.practiceLocation?.city}, {practitioner.practiceLocation?.state}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Verified
                    </div>
                  </div>
                  
                  {practitioner.bio && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{practitioner.bio}</p>
                  )}
                  
                  <div className="space-y-2 mb-4">
                    {practitioner.practiceAreas && practitioner.practiceAreas.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">Specializations:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {practitioner.practiceAreas.slice(0, 2).map((area, index) => (
                            <span key={index} className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                              {area}
                            </span>
                          ))}
                          {practitioner.practiceAreas.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{practitioner.practiceAreas.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {practitioner.experience || 0} years experience
                      </div>
                      {practitioner.consultationFee > 0 && (
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          ₹{practitioner.consultationFee}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleAssignPractitioner(practitioner)}
                    className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Assign to Me
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assignment Confirmation Modal */}
        {showAssignmentModal && selectedPractitioner && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Confirm Assignment</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to assign yourself to <strong>Dr. {selectedPractitioner.name}</strong>? 
                This will be your primary practitioner for all treatments and consultations.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowAssignmentModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAssignment}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Confirm Assignment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PractitionerSearch;
