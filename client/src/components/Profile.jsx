import React, { useState, useEffect } from 'react';
import { User, MapPin, Phone, Heart, Calendar, Users, Save, Edit3, Shield, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useToast } from '../contexts/ToastContext.jsx';

const Profile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    caregiverPhone: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    personalDetails: {
      dateOfBirth: '',
      gender: '',
      bloodGroup: ''
    },
    licenseNumber: '',
    verificationStatus: 'pending',
    // Practitioner-specific fields
    practiceLocation: {
      address: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
      coordinates: {
        latitude: null,
        longitude: null
      }
    },
    practiceAreas: [],
    consultationFee: 0,
    availableForNewPatients: true,
    bio: '',
    experience: 0
  });

  const [initialData, setInitialData] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [additionalDocuments, setAdditionalDocuments] = useState('');

  const { show } = useToast();

  // Fetch user profile data
  useEffect(() => {
    fetchProfile();
    if (user?.userType === 'practitioner') {
      fetchVerificationStatus();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        show({
          title: 'Error',
          message: 'No authentication token found. Please log in again.',
          duration: 4000
        });
        return;
      }

      const response = await fetch('http://localhost:5000/api/profile', {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Merge with default structure to ensure all fields exist
        const mergedData = {
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          caregiverPhone: data.caregiverPhone || '',
          address: {
            street: data.address?.street || '',
            city: data.address?.city || '',
            state: data.address?.state || '',
            pincode: data.address?.pincode || '',
            country: data.address?.country || 'India'
          },
          emergencyContact: {
            name: data.emergencyContact?.name || '',
            phone: data.emergencyContact?.phone || '',
            relationship: data.emergencyContact?.relationship || ''
          },
          personalDetails: {
            dateOfBirth: data.personalDetails?.dateOfBirth || '',
            gender: data.personalDetails?.gender || '',
            bloodGroup: data.personalDetails?.bloodGroup || ''
          },
          licenseNumber: data.licenseNumber || '',
          verificationStatus: data.verificationStatus || 'pending',
          // Practitioner-specific fields
          practiceLocation: {
            address: data.practiceLocation?.address || '',
            city: data.practiceLocation?.city || '',
            state: data.practiceLocation?.state || '',
            pincode: data.practiceLocation?.pincode || '',
            country: data.practiceLocation?.country || 'India',
            coordinates: {
              latitude: data.practiceLocation?.coordinates?.latitude || null,
              longitude: data.practiceLocation?.coordinates?.longitude || null
            }
          },
          practiceAreas: data.practiceAreas || [],
          consultationFee: data.consultationFee || 0,
          availableForNewPatients: data.availableForNewPatients !== undefined ? data.availableForNewPatients : true,
          bio: data.bio || '',
          experience: data.experience || 0
        };
        
        setProfileData(mergedData);
        setInitialData(mergedData);
        setDataLoaded(true);
      } else {
        const errorData = await response.json();
        show({
          title: 'Error',
          message: errorData.message || 'Failed to load profile data',
          duration: 4000
        });
      }
    } catch (error) {
      show({
        title: 'Error',
        message: 'Failed to load profile data',
        duration: 4000
      });
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };


  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        show({
          title: 'Error',
          message: 'No authentication token found. Please log in again.',
          duration: 4000
        });
        return;
      }

      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData(data.user);
        setInitialData(data.user);
        setIsEditing(false);
        show({
          title: 'Success',
          message: 'Profile updated successfully! ✅',
          duration: 4000
        });
      } else {
        const errorData = await response.json();
        show({
          title: 'Error',
          message: errorData.message || 'Failed to update profile',
          duration: 4000
        });
      }
    } catch (error) {
      show({
        title: 'Error',
        message: 'Failed to update profile',
        duration: 4000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (initialData) {
      setProfileData(initialData);
    }
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  const fetchVerificationStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/verification/status', {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setVerificationStatus(data);
      }
    } catch (error) {
      console.error('Error fetching verification status:', error);
    }
  };

  const handleVerificationRequest = async () => {
    if (!profileData.licenseNumber) {
      show({
        title: 'Error',
        message: 'Please enter your license number first',
        duration: 4000
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/verification/submit', {
        method: 'POST',
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          licenseNumber: profileData.licenseNumber,
          additionalDocuments
        })
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData(data.user);
        setVerificationStatus({
          verificationStatus: 'pending',
          licenseNumber: profileData.licenseNumber
        });
        setShowVerificationModal(false);
        show({
          title: 'Success',
          message: 'Verification request submitted successfully!',
          duration: 4000
        });
      } else {
        const errorData = await response.json();
        show({
          title: 'Error',
          message: errorData.message || 'Failed to submit verification request',
          duration: 4000
        });
      }
    } catch (error) {
      show({
        title: 'Error',
        message: 'Failed to submit verification request',
        duration: 4000
      });
    } finally {
      setLoading(false);
    }
  };

  const getVerificationIcon = (status) => {
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

  const getVerificationColor = (status) => {
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

  // Show loading state while data is being fetched
  if (!dataLoaded && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ayurveda-chandana/20 via-ayurveda-haldi/10 to-ayurveda-kumkum/20 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ayurveda-kumkum mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Loading Profile...
          </h2>
          <p className="text-gray-500">
            Please wait while we load your profile data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ayurveda-chandana/20 via-ayurveda-haldi/10 to-ayurveda-kumkum/20 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-8 mb-6 border border-ayurveda-kumkum/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-ayurveda-kumkum to-ayurveda-brahmi rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-display text-dosha-kapha">My Profile</h1>
                <p className="text-gray-600">Manage your personal information and medical details</p>
              </div>
            </div>
            <button
              onClick={isEditing ? handleCancel : () => setIsEditing(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-ayurveda-kumkum to-ayurveda-brahmi text-white rounded-xl hover:shadow-lg transition-all duration-300"
            >
              <Edit3 className="w-5 h-5" />
              <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-ayurveda-kumkum/20">
            <h2 className="text-xl font-display text-dosha-kapha mb-6 flex items-center">
              <User className="w-6 h-6 mr-2" />
              Personal Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-ayurveda-kumkum/20 focus:border-ayurveda-kumkum disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  disabled
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={profileData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-ayurveda-kumkum/20 focus:border-ayurveda-kumkum disabled:bg-gray-100"
                />
              </div>

              {/* Show caregiver phone only for patients */}
              {user?.userType === 'patient' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Caregiver Phone</label>
                  <input
                    type="tel"
                    value={profileData.caregiverPhone || ''}
                    onChange={(e) => handleInputChange('caregiverPhone', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Emergency contact phone number"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-ayurveda-kumkum/20 focus:border-ayurveda-kumkum disabled:bg-gray-100"
                  />
                </div>
              )}

              {/* Show license number only for practitioners */}
              {user?.userType === 'practitioner' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">License Number</label>
                  <input
                    type="text"
                    value={profileData.licenseNumber || ''}
                    onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter your medical license number"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-ayurveda-kumkum/20 focus:border-ayurveda-kumkum disabled:bg-gray-100"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-ayurveda-kumkum/20">
            <h2 className="text-xl font-display text-dosha-kapha mb-6 flex items-center">
              <MapPin className="w-6 h-6 mr-2" />
              Address Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address</label>
                <input
                  type="text"
                  value={profileData.address?.street || ''}
                  onChange={(e) => handleInputChange('address.street', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-ayurveda-kumkum/20 focus:border-ayurveda-kumkum disabled:bg-gray-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={profileData.address?.city || ''}
                    onChange={(e) => handleInputChange('address.city', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-ayurveda-kumkum/20 focus:border-ayurveda-kumkum disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    value={profileData.address?.state || ''}
                    onChange={(e) => handleInputChange('address.state', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-ayurveda-kumkum/20 focus:border-ayurveda-kumkum disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode</label>
                  <input
                    type="text"
                    value={profileData.address?.pincode || ''}
                    onChange={(e) => handleInputChange('address.pincode', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-ayurveda-kumkum/20 focus:border-ayurveda-kumkum disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    value={profileData.address?.country || 'India'}
                    onChange={(e) => handleInputChange('address.country', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-ayurveda-kumkum/20 focus:border-ayurveda-kumkum disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Practice Location - Only for practitioners */}
          {user?.userType === 'practitioner' && (
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-ayurveda-kumkum/20">
              <h2 className="text-xl font-display text-dosha-kapha mb-6 flex items-center">
                <MapPin className="w-6 h-6 mr-2" />
                Practice Location
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Practice Address</label>
                  <input
                    type="text"
                    value={profileData.practiceLocation?.address || ''}
                    onChange={(e) => handleInputChange('practiceLocation.address', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter your practice address"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-ayurveda-kumkum/20 focus:border-ayurveda-kumkum disabled:bg-gray-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={profileData.practiceLocation?.city || ''}
                      onChange={(e) => handleInputChange('practiceLocation.city', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-ayurveda-kumkum/20 focus:border-ayurveda-kumkum disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                    <input
                      type="text"
                      value={profileData.practiceLocation?.state || ''}
                      onChange={(e) => handleInputChange('practiceLocation.state', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-ayurveda-kumkum/20 focus:border-ayurveda-kumkum disabled:bg-gray-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode</label>
                    <input
                      type="text"
                      value={profileData.practiceLocation?.pincode || ''}
                      onChange={(e) => handleInputChange('practiceLocation.pincode', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-ayurveda-kumkum/20 focus:border-ayurveda-kumkum disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                    <input
                      type="text"
                      value={profileData.practiceLocation?.country || 'India'}
                      onChange={(e) => handleInputChange('practiceLocation.country', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-ayurveda-kumkum/20 focus:border-ayurveda-kumkum disabled:bg-gray-100"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Practice Details - Only for practitioners */}
          {user?.userType === 'practitioner' && (
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-ayurveda-kumkum/20">
              <h2 className="text-xl font-display text-dosha-kapha mb-6 flex items-center">
                <Users className="w-6 h-6 mr-2" />
                Practice Details
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                  <textarea
                    value={profileData.bio || ''}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Tell patients about your experience and approach"
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-ayurveda-kumkum/20 focus:border-ayurveda-kumkum disabled:bg-gray-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Years of Experience</label>
                    <input
                      type="number"
                      value={profileData.experience || 0}
                      onChange={(e) => handleInputChange('experience', parseInt(e.target.value) || 0)}
                      disabled={!isEditing}
                      min="0"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-ayurveda-kumkum/20 focus:border-ayurveda-kumkum disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Consultation Fee (₹)</label>
                    <input
                      type="number"
                      value={profileData.consultationFee || 0}
                      onChange={(e) => handleInputChange('consultationFee', parseInt(e.target.value) || 0)}
                      disabled={!isEditing}
                      min="0"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-ayurveda-kumkum/20 focus:border-ayurveda-kumkum disabled:bg-gray-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Practice Areas</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'Vamana (Therapeutic Vomiting)',
                      'Virechana (Purgation Therapy)',
                      'Basti (Medicated Enema)',
                      'Nasya (Nasal Administration)',
                      'Raktamoksha (Bloodletting)',
                      'General Consultation',
                      'Wellness Counseling'
                    ].map((area) => (
                      <label key={area} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={profileData.practiceAreas?.includes(area) || false}
                          onChange={(e) => {
                            const currentAreas = profileData.practiceAreas || [];
                            if (e.target.checked) {
                              handleInputChange('practiceAreas', [...currentAreas, area]);
                            } else {
                              handleInputChange('practiceAreas', currentAreas.filter(a => a !== area));
                            }
                          }}
                          disabled={!isEditing}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">{area}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="availableForNewPatients"
                    checked={profileData.availableForNewPatients || false}
                    onChange={(e) => handleInputChange('availableForNewPatients', e.target.checked)}
                    disabled={!isEditing}
                    className="mr-2"
                  />
                  <label htmlFor="availableForNewPatients" className="text-sm font-semibold text-gray-700">
                    Available for new patients
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Emergency Contact - Only for patients */}
          {user?.userType === 'patient' && (
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-ayurveda-kumkum/20">
              <h2 className="text-xl font-display text-dosha-kapha mb-6 flex items-center">
                <Phone className="w-6 h-6 mr-2" />
                Emergency Contact
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Name</label>
                  <input
                    type="text"
                    value={profileData.emergencyContact?.name || ''}
                    onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-ayurveda-kumkum/20 focus:border-ayurveda-kumkum disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Phone</label>
                  <input
                    type="tel"
                    value={profileData.emergencyContact?.phone || ''}
                    onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-ayurveda-kumkum/20 focus:border-ayurveda-kumkum disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Relationship</label>
                  <input
                    type="text"
                    value={profileData.emergencyContact?.relationship || ''}
                    onChange={(e) => handleInputChange('emergencyContact.relationship', e.target.value)}
                    disabled={!isEditing}
                    placeholder="e.g., Spouse, Parent, Sibling"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-ayurveda-kumkum/20 focus:border-ayurveda-kumkum disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Verification Status - Only for practitioners */}
          {user?.userType === 'practitioner' && (
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-ayurveda-kumkum/20">
              <h2 className="text-xl font-display text-dosha-kapha mb-6 flex items-center">
                <Shield className="w-6 h-6 mr-2" />
                Verification Status
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getVerificationIcon(verificationStatus?.verificationStatus || profileData.verificationStatus)}
                    <div>
                      <p className="font-semibold text-gray-900">Verification Status</p>
                      <p className="text-sm text-gray-600">
                        {verificationStatus?.verificationStatus || profileData.verificationStatus || 'Not submitted'}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getVerificationColor(verificationStatus?.verificationStatus || profileData.verificationStatus)}`}>
                    {verificationStatus?.verificationStatus || profileData.verificationStatus || 'Not submitted'}
                  </span>
                </div>

                {verificationStatus?.verificationRequest && (
                  <div className="text-sm text-gray-600">
                    <p><strong>Submitted:</strong> {new Date(verificationStatus.verificationRequest.submittedAt).toLocaleString()}</p>
                    {verificationStatus.verificationRequest.adminNotes && (
                      <p><strong>Admin Notes:</strong> {verificationStatus.verificationRequest.adminNotes}</p>
                    )}
                  </div>
                )}

                {(verificationStatus?.verificationStatus === 'pending' || !verificationStatus?.verificationStatus) && (
                  <button
                    onClick={() => setShowVerificationModal(true)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-ayurveda-kumkum to-ayurveda-brahmi text-white rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    <Shield className="w-5 h-5" />
                    <span>Submit Verification Request</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Personal Details */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-ayurveda-kumkum/20">
            <h2 className="text-xl font-display text-dosha-kapha mb-6 flex items-center">
              <Heart className="w-6 h-6 mr-2" />
              Personal Details
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={formatDate(profileData.personalDetails?.dateOfBirth)}
                  onChange={(e) => handleInputChange('personalDetails.dateOfBirth', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-ayurveda-kumkum/20 focus:border-ayurveda-kumkum disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                <select
                  value={profileData.personalDetails?.gender || ''}
                  onChange={(e) => handleInputChange('personalDetails.gender', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-ayurveda-kumkum/20 focus:border-ayurveda-kumkum disabled:bg-gray-100"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Blood Group</label>
                <select
                  value={profileData.personalDetails?.bloodGroup || ''}
                  onChange={(e) => handleInputChange('personalDetails.bloodGroup', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-ayurveda-kumkum/20 focus:border-ayurveda-kumkum disabled:bg-gray-100"
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>
            </div>
          </div>
        </div>


        {/* Save Button */}
        {isEditing && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-ayurveda-kumkum to-ayurveda-brahmi text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        )}

        {/* Verification Request Modal */}
        {showVerificationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Submit Verification Request
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    License Number
                  </label>
                  <input
                    type="text"
                    value={profileData.licenseNumber}
                    onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayurveda-kumkum focus:border-ayurveda-kumkum"
                    placeholder="Enter your medical license number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Documents (Optional)
                  </label>
                  <textarea
                    value={additionalDocuments}
                    onChange={(e) => setAdditionalDocuments(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayurveda-kumkum focus:border-ayurveda-kumkum"
                    rows="3"
                    placeholder="Provide any additional information or document references..."
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleVerificationRequest}
                  disabled={loading || !profileData.licenseNumber}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  <Shield className="w-4 h-4" />
                  <span>{loading ? 'Submitting...' : 'Submit Request'}</span>
                </button>
                <button
                  onClick={() => setShowVerificationModal(false)}
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

export default Profile;
