import React from 'react';
import { Users } from 'lucide-react';

const dummyUsers = [
  { id: 1, name: 'Alice Johnson', email: 'alice.johnson@elabhub.com', role: 'Lab Technician', status: 'Active' },
  { id: 2, name: 'Bob Smith', email: 'bob.smith@elabhub.com', role: 'Admin', status: 'Active' },
  { id: 3, name: 'Carol Lee', email: 'carol.lee@elabhub.com', role: 'Technician', status: 'Inactive' },
  { id: 4, name: 'David Kim', email: 'david.kim@elabhub.com', role: 'Patient', status: 'Active' },
  { id: 5, name: 'Eva Brown', email: 'eva.brown@elabhub.com', role: 'Lab Technician', status: 'Active' },
  { id: 6, name: 'Frank Green', email: 'frank.green@elabhub.com', role: 'Technician', status: 'Inactive' },
  { id: 7, name: 'Grace Hopper', email: 'grace.hopper@elabhub.com', role: 'Admin', status: 'Active' },
  { id: 8, name: 'Hank Pym', email: 'hank.pym@elabhub.com', role: 'Patient', status: 'Inactive' }
];

const UsersPage = () => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Users className="h-6 w-6 text-blue-600" /> Users
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Email</th>
              <th className="px-4 py-2 border-b">Role</th>
              <th className="px-4 py-2 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {dummyUsers.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b font-medium">{user.name}</td>
                <td className="px-4 py-2 border-b">{user.email}</td>
                <td className="px-4 py-2 border-b">{user.role}</td>
                <td className={`px-4 py-2 border-b ${user.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>{user.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;
