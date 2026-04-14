import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  BarChart, Bar as RechartsBar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart as RechartsPieChart, Pie as RechartsPie, Cell, ResponsiveContainer
} from 'recharts';

// Integrated Imports
import DonationCalendar from '../Components/DonationCalender';
import LeaderboardTable from '../Components/Leaderboard';
import SalesAnalytics from '../Components/SalesAnalytics';
import PaymentVerification from '../Components/PaymentVerification'; // Preserved from old code

const Sidebar = ({ onSelectTab, activeTab }) => {
  const items = [
    { key: 'dashboard', label: 'Dashboard', icon: '📊' },
    { key: 'users', label: 'User Management', icon: '👥' },
    { key: 'acceptance', label: 'User Approvals', icon: '✅' },
    // { key: 'reports', label: 'Reports', icon: '📈' },
    { key: 'calendar', label: 'Donation Calendar', icon: '📅' },
    { key: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
    { key: 'payments', label: 'Payment Verification', icon: '💳' },
  ];

  return (
    <div className="w-64 bg-slate-900 h-screen text-white fixed left-0 top-0 hidden md:flex flex-col shadow-xl">
      <div className="p-6 text-2xl font-bold border-b border-slate-800 tracking-tight">
        Admin<span className="text-emerald-400">Panel</span>
      </div>
      <ul className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {items.map((item) => (
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

const Topbar = ({ username, onLogout }) => (
  <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
    <h3 className="text-slate-800 font-semibold text-lg hidden md:block">Food Waste Management System</h3>
    <div className="flex items-center space-x-4 ml-auto">
      <div className="text-right">
        <p className="text-xs text-slate-500 font-medium">Logged in as</p>
        <p className="text-sm text-slate-900 font-bold">{username || 'Admin'}</p>
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

const Dashboard = ({ stats }) => (
  <div className="p-8 animate-fadeIn">
    <h2 className="text-2xl font-bold text-slate-800 mb-6">System Overview</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {[
        { label: 'Total Waste', value: `${stats.totalWaste} Kg`, color: 'emerald', icon: '♻️' },
        { label: 'Total Users', value: stats.totalUsers, color: 'blue', icon: '👥' },
        { label: 'Waste Today', value: `${stats.wasteCollectedToday} Kg`, color: 'amber', icon: '⏱️' }
      ].map((card, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{card.label}</p>
              <h3 className="text-3xl font-bold text-slate-900">{card.value}</h3>
            </div>
            <span className={`p-3 rounded-xl bg-${card.color}-50 text-2xl`}>{card.icon}</span>
          </div>
        </div>
      ))}
    </div>
    {/* Merged SalesAnalytics into Dashboard for a richer overview */}
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <SalesAnalytics />
    </div>
  </div>
);

const UserManagement = ({ users, onDelete }) => (
  <div className="p-8">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
      <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-medium">
        {users.length} Total Users
      </span>
    </div>
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users.map((user) => (
            <tr key={user.email} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-slate-900">{user.name}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
              <td className="px-6 py-4 text-sm">
                <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${
                  user.role?.toLowerCase() === 'ngo' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4">
                <button 
                  onClick={() => window.confirm('Delete user?') && onDelete(user.email)}
                  className="text-rose-600 hover:text-rose-800 text-sm font-semibold underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const UserApprovals = ({ pendingUsers, onApprove, onReject }) => (
  <div className="p-8">
    <h2 className="text-2xl font-bold text-slate-800 mb-6">Pending Approvals</h2>
    {pendingUsers.length === 0 ? (
      <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-500">
        No pending NGO users for approval.
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pendingUsers.map((user) => (
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between" key={user.email}>
            <div>
              <p className="font-bold text-slate-900">{user.name}</p>
              <p className="text-sm text-slate-500">{user.email}</p>
            </div>
            <div className="flex space-x-2">
              <button 
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-bold hover:bg-emerald-600 transition-colors shadow-sm" 
                onClick={() => onApprove(user.email)}
              >
                Approve
              </button>
              <button 
                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors" 
                onClick={() => onReject(user.email)}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [username, setUsername] = useState('');
  const [stats, setStats] = useState({ totalWaste: 0, totalUsers: 0, wasteCollectedToday: 0 });
  const [users, setUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [dashRes, usersRes, pendingRes] = await Promise.all([
        axios.get('http://localhost:8080/admin/dashboard'),
        axios.get('http://localhost:8080/admin/users'),
        axios.get('http://localhost:8080/admin/users/pending')
      ]);
      setStats(dashRes.data);
      setUsers(usersRes.data);
      setPendingUsers(pendingRes.data.filter(u => u.role?.toLowerCase() === 'ngo' && u.status === 'PENDING'));
    } catch (err) {
      console.error("Data fetch error:", err);
    }
  };

  useEffect(() => {
    const storedName = localStorage.getItem('username');
    if (storedName) {
      setUsername(storedName);
      fetchData();
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => { localStorage.clear(); navigate('/'); };
  
  const handleDelete = (email) => 
    axios.delete(`http://localhost:8080/admin/users/${email}`)
      .then(() => { alert('User Deleted'); fetchData(); });

  const handleApprove = (email) => 
    axios.post('http://localhost:8080/admin/approve', { email })
      .then(r => { alert(r.data); fetchData(); });

  const handleReject = (email) => 
    axios.post('http://localhost:8080/admin/reject', { email })
      .then(r => { alert(r.data); fetchData(); });

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':   return <Dashboard stats={stats} />;
      case 'users':       return <UserManagement users={users} onDelete={handleDelete} />;
      case 'acceptance':  return <UserApprovals pendingUsers={pendingUsers} onApprove={handleApprove} onReject={handleReject} />;
      case 'reports':     return <SalesAnalytics />; // Using the modern Analytics component for Reports
      case 'calendar':    return <div className="p-8 bg-white m-8 rounded-2xl border border-slate-100 shadow-sm"><DonationCalendar /></div>;
      case 'leaderboard': return <div className="p-8"><LeaderboardTable /></div>;
      case 'payments':    return <div className="p-8"><PaymentVerification verifierName={username} /></div>;
      default:            return <Dashboard stats={stats} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar onSelectTab={setActiveTab} activeTab={activeTab} />
      <div className="flex-1 md:ml-64 flex flex-col">
        <Topbar username={username} onLogout={handleLogout} />
        <main className="flex-grow pb-12">
          {renderTab()}
        </main>
      </div>
    </div>
  );
}

export default AdminPanel;