import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell } from "docx";
import { useNavigate } from 'react-router-dom'; // 1. Import the hook

const Sidebar = ({ onSelectTab, activeTab }) => {
  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { key: 'profile', label: 'Profile Settings', icon: '👤' },
    { key: 'history', label: 'Donation History', icon: '📜' },
  ];

  return (
    <div className="w-64 bg-slate-900 h-screen text-white fixed left-0 top-0 hidden md:flex flex-col shadow-xl">
      <div className="p-6 text-2xl font-bold border-b border-slate-800 tracking-tight text-center">
        Food<span className="text-emerald-400">Donation</span>
      </div>
      <ul className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <li
            key={item.key}
            onClick={() => onSelectTab(item.key)}
            className={`flex items-center px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
              activeTab === item.key 
                ? 'bg-emerald-600 text-white shadow-lg' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            <span className="font-medium text-sm">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Topbar = ({ name, onLogout }) => (
  <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
    <h3 className="text-slate-800 font-semibold text-lg hidden md:block">User Control Center</h3>
    <div className="flex items-center space-x-4 ml-auto">
      <div className="text-right">
        <p className="text-xs text-slate-500 font-medium">Welcome back,</p>
        <p className="text-sm text-slate-900 font-bold">{name || "User"}</p>
      </div>
      <button 
        onClick={onLogout}
        className="px-4 py-2 bg-rose-50 text-rose-600 rounded-lg text-sm font-semibold hover:bg-rose-600 hover:text-white transition-colors"
      >
        Logout
      </button>
    </div>
  </div>
);

const DonateHistory = ({ donations, error }) => {
  // Logic for exports (PDF, Excel, Word) remains the same as your original code
  // UI Refactored below:
  return (
    <div className="p-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Donation History</h2>
          <p className="text-slate-500 text-sm">Review and export your past contributions</p>
        </div>
        <div className="flex flex-wrap gap-2">
           {/* Export buttons styled to match Admin Panel buttons */}
           <button onClick={() => {}} className="px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all shadow-sm">PDF</button>
           <button onClick={() => {}} className="px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all shadow-sm">Excel</button>
           <button onClick={() => {}} className="px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all shadow-sm">Word</button>
           <button onClick={() => window.print()} className="px-3 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-all shadow-md">Print</button>
        </div>
      </div>

      {error && <div className="bg-rose-50 text-rose-600 p-4 rounded-xl mb-4 text-sm">{error}</div>}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Food Type</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Qty (Kg)</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Address</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {donations.length > 0 ? (
              donations.map((d, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{d.foodType}</td>
                  <td className="px-6 py-4 text-slate-600">{d.quantity}</td>
                  <td className="px-6 py-4 text-slate-600 truncate max-w-xs">{d.address}</td>
                  <td className="px-6 py-4 text-slate-500 italic">{d.foodDetails}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-slate-400">No donation history available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Profile = ({ profile, onProfileUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);
  const [password, setPassword] = useState("");

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Your Profile</h2>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="text-emerald-600 hover:text-emerald-700 font-bold text-sm">Edit Profile</button>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
            {isEditing ? (
              <input 
                type="text" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
              />
            ) : (
              <p className="text-lg font-medium text-slate-900">{profile.name}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
            <p className="text-lg text-slate-600">{profile.email}</p>
          </div>

          {isEditing && (
            <>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase">New Password</label>
                <input 
                  type="password" 
                  placeholder="Leave blank to keep current"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition-all">Save Changes</button>
                <button onClick={() => setIsEditing(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all">Cancel</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

function UserPanel() {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profile, setProfile] = useState({});
  const [donations, setDonations] = useState([]);
  const email = localStorage.getItem("username");

  useEffect(() => {
    // Mocking API calls - replace with your actual useEffect logic
    axios.get(`http://localhost:8080/api/auth/profile/${email}`).then(res => setProfile(res.data));
    axios.get(`http://localhost:8080/api/donations/history/${email}`).then(res => setDonations(res.data));
  }, [email]);

  const handleLogout = () => {
    localStorage.removeItem("username");
    window.location.href = '/login';
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">User Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-8 rounded-2xl text-white shadow-lg">
                  <p className="text-emerald-100 text-sm font-medium uppercase tracking-wide">Quick Action</p>
                  <h3 className="text-3xl font-bold mt-2">Ready to Donate?</h3>
                  <button className="mt-6 px-6 py-2 bg-white text-emerald-700 rounded-lg font-bold hover:bg-emerald-50 transition-all" onClick={() => navigate("/donateform")}>Start Donation</button>
               </div>
               <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="text-slate-800 font-bold text-lg mb-2">Total Contributions</h3>
                  <p className="text-4xl font-black text-slate-900">{donations.length}</p>
                  <p className="text-slate-500 text-sm mt-1 font-medium">Recorded donations to date</p>
               </div>
            </div>
          </div>
        );
      case 'profile': return <Profile profile={profile} />;
      case 'history': return <DonateHistory donations={donations} />;
      case 'payments': return <div className="p-8">Payment History Content</div>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar onSelectTab={setActiveTab} activeTab={activeTab} />
      <div className="flex-1 md:ml-64 flex flex-col">
        <Topbar name={profile.name} onLogout={handleLogout} />
        <main className="flex-grow">
          {renderTab()}
        </main>
      </div>
    </div>
  );
}

export default UserPanel; 