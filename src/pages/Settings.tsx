import React, { useState } from 'react';

const SettingsPage = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState('');

  // Simulate loading user data
  React.useEffect(() => {
    // Replace with real API call
    const user = JSON.parse(localStorage.getItem('user_profile') || '{}');
    setProfile({
      name: user.name || 'Admin User',
      email: user.email || 'admin@example.com',
      phone: user.phone || '',
      password: '',
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Replace with real API call
    localStorage.setItem('user_profile', JSON.stringify(profile));
    setEditMode(false);
    setMessage('Profile updated successfully!');
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      {message && <div className="mb-4 text-green-600">{message}</div>}
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            disabled={!editMode}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            disabled={!editMode}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            disabled={!editMode}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={profile.password}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            disabled={!editMode}
            placeholder="••••••••"
          />
        </div>
        <div className="flex gap-2 mt-4">
          {editMode ? (
            <>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
              <button type="button" className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300" onClick={() => setEditMode(false)}>Cancel</button>
            </>
          ) : (
            <button type="button" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={() => setEditMode(true)}>Edit Profile</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
