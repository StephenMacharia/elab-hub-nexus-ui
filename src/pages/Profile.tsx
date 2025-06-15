
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, X } from 'lucide-react';
import Layout from '@/components/Layout';

interface ProfileProps {
  userRole: 'admin' | 'technician' | 'patient';
  userName: string;
}

const Profile = ({ userRole, userName }: ProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: userName,
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, City, State 12345',
    dateOfBirth: '1990-05-15',
    emergencyContact: 'Jane Smith - +1 (555) 987-6543',
    bloodType: 'O+',
    allergies: 'Penicillin, Shellfish',
    medicalHistory: 'Hypertension, Diabetes Type 2'
  });

  const [editData, setEditData] = useState(profileData);

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const readOnlyClasses = "text-gray-900 font-medium";

  return (
    <Layout userRole={userRole} userName={userName}>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600 mt-1">Manage your personal information</p>
          </div>
          <div className="mt-4 sm:mt-0">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Picture */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <div className="text-center">
              <div className="h-32 w-32 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-16 w-16 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{profileData.name}</h3>
              <p className="text-gray-600 capitalize">{userRole}</p>
              <button className="mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                Change Photo
              </button>
            </div>
          </motion.div>

          {/* Profile Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline h-4 w-4 mr-1" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                    className={inputClasses}
                  />
                ) : (
                  <p className={readOnlyClasses}>{profileData.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline h-4 w-4 mr-1" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({...editData, email: e.target.value})}
                    className={inputClasses}
                  />
                ) : (
                  <p className={readOnlyClasses}>{profileData.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline h-4 w-4 mr-1" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => setEditData({...editData, phone: e.target.value})}
                    className={inputClasses}
                  />
                ) : (
                  <p className={readOnlyClasses}>{profileData.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Date of Birth
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editData.dateOfBirth}
                    onChange={(e) => setEditData({...editData, dateOfBirth: e.target.value})}
                    className={inputClasses}
                  />
                ) : (
                  <p className={readOnlyClasses}>{profileData.dateOfBirth}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Address
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.address}
                    onChange={(e) => setEditData({...editData, address: e.target.value})}
                    className={inputClasses}
                  />
                ) : (
                  <p className={readOnlyClasses}>{profileData.address}</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Medical Information (Patient Only) */}
        {userRole === 'patient' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Medical Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Blood Type</label>
                {isEditing ? (
                  <select
                    value={editData.bloodType}
                    onChange={(e) => setEditData({...editData, bloodType: e.target.value})}
                    className={inputClasses}
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                ) : (
                  <p className={readOnlyClasses}>{profileData.bloodType}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.emergencyContact}
                    onChange={(e) => setEditData({...editData, emergencyContact: e.target.value})}
                    className={inputClasses}
                  />
                ) : (
                  <p className={readOnlyClasses}>{profileData.emergencyContact}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
                {isEditing ? (
                  <textarea
                    value={editData.allergies}
                    onChange={(e) => setEditData({...editData, allergies: e.target.value})}
                    className={`${inputClasses} h-20 resize-none`}
                    placeholder="List any known allergies..."
                  />
                ) : (
                  <p className={readOnlyClasses}>{profileData.allergies}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Medical History</label>
                {isEditing ? (
                  <textarea
                    value={editData.medicalHistory}
                    onChange={(e) => setEditData({...editData, medicalHistory: e.target.value})}
                    className={`${inputClasses} h-24 resize-none`}
                    placeholder="Brief medical history..."
                  />
                ) : (
                  <p className={readOnlyClasses}>{profileData.medicalHistory}</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default Profile;
