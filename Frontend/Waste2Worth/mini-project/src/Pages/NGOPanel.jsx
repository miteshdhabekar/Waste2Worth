import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph } from "docx";

// --- Sub-Components (Moved outside main function) ---

const Overview = ({ stats }) => {
  // Safe extraction of stats with fallback values to prevent crashes
  const totalDonations = stats?.totalDonations || 0;
  const pendingRequests = stats?.pendingRequests || 0;
  const totalFoodRescued = stats?.totalFoodRescued || 0;
  const totalFertilizerOrders = stats?.totalFertilizerOrders || 0;
  const totalRevenue = stats?.totalRevenue || 0;

  const cards = [
    { label: "Total Donations", value: totalDonations, color: "bg-blue-500", icon: "📦" },
    { label: "Pending Requests", value: pendingRequests, color: "bg-yellow-500", icon: "⏳" },
    { label: "Food Rescued", value: `${totalFoodRescued.toFixed(1)} Kg`, color: "bg-green-500", icon: "🍏" },
    { label: "Fertilizer Orders", value: totalFertilizerOrders, color: "bg-purple-500", icon: "🌱" },
    { label: "Revenue Generated", value: `₹${totalRevenue.toFixed(0)}`, color: "bg-teal-500", icon: "💰" },
  ];

  return (
    <div className="p-5 animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">NGO Performance Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm flex items-center border border-gray-100 p-6 hover:shadow-md transition">
            <div className={`${card.color} p-4 rounded-lg text-white text-3xl mr-5 shadow-inner`}>
              {card.icon}
            </div>
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{card.label}</p>
              <h3 className="text-3xl font-black text-gray-800">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
            <span>♻️</span> Waste to Worth Lifecycle
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          The NGO panel is the central hub for managing the transformation of local food waste into high-quality organic fertilizer. 
          By accepting fresh food for distribution and rotten food for composting, you are closing the loop on sustainability.
        </p>
      </div>
    </div>
  );
};

const Sidebar = ({ onSelectTab, activeTab }) => (
  <div className="w-64 bg-blue-600 text-white p-5 flex flex-col items-center min-h-screen sticky top-0">
    <h2 className="text-2xl font-bold mb-10 uppercase tracking-tighter">NGO Dashboard</h2>
    <ul className="w-full">
      {[
        ['overview', 'Overview'],
        ['freshFood', 'Fresh Food Requests'],
        ['rottenFood', 'Rotten Food Requests'],
        ['donations', 'Donations History'],
        ['fertilizerBooking', 'Fertilizer Bookings']
      ].map(([key, label]) => (
        <li
          key={key}
          onClick={() => onSelectTab(key)}
          className={`p-3 my-2 text-center font-bold rounded cursor-pointer transition-all duration-200 ${
            activeTab === key 
            ? 'bg-white text-blue-600 shadow-lg' 
            : 'bg-blue-500 text-white hover:bg-blue-400'
          }`}
        >
          {label}
        </li>
      ))}
    </ul>
  </div>
);

const Topbar = () => {
  const username = localStorage.getItem("username") || "NGO User";
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center bg-gray-800 text-white px-6 py-4 mb-5 rounded shadow-md">
      <h3 className="text-xl font-semibold">Food Waste Management System</h3>
      <div className="flex items-center gap-4">
        <div className="text-right mr-2">
            <p className="text-[10px] text-gray-400 uppercase font-bold">Organization</p>
            <p className="text-sm font-bold">{username}</p>
        </div>
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
          className="bg-red-500 px-4 py-2 rounded text-sm font-bold hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

const DonationRequests = ({ donations, onAccept, onReject }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-5">
    {donations.length === 0 ? (
        <div className="col-span-full py-20 text-center text-gray-400 font-medium bg-white rounded-xl border-2 border-dashed">
            No pending requests in this category.
        </div>
    ) : (
        donations.map((donation) => (
            <div
              key={donation.id}
              className={`bg-white p-5 rounded-xl shadow-md border-l-4 hover:scale-[1.02] transition ${
                donation.foodType === 'Rotten' ? 'border-orange-500' : 'border-green-500'
              }`}
            >
              <p className="mb-1 text-sm"><strong>Donor:</strong> {donation.name}</p>
              <p className="mb-1 text-sm"><strong>Quantity:</strong> {donation.quantity} Kg</p>
              <p className="mb-1 text-sm"><strong>Location:</strong> {donation.address}</p>
              <p className="mb-3 text-sm"><strong>Food Type:</strong> {donation.foodType}</p>
      
              <img src={donation.imageUrl} alt="Food" className="w-full h-40 object-cover mt-2 rounded border" />
      
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => onAccept(donation)}
                  className="flex-1 bg-green-600 py-2 text-white text-sm font-bold rounded hover:bg-green-700 transition"
                >
                  Accept
                </button>
                <button
                  onClick={() => onReject(donation)}
                  className="flex-1 bg-red-600 py-2 text-white text-sm font-bold rounded hover:bg-red-700 transition"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
    )}
  </div>
);

const DonationsTable = ({ donations, exportToPDF, exportToExcel, exportToWord }) => (
  <div className="p-6 bg-gray-50 min-h-screen rounded-xl border border-gray-200">
    <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-700">Accepted Donations History</h3>
        <div className="flex gap-2">
          <button onClick={exportToPDF} className="bg-red-500 px-3 py-1.5 text-xs font-bold text-white rounded hover:bg-red-600 transition">PDF</button>
          <button onClick={exportToExcel} className="bg-green-600 px-3 py-1.5 text-xs font-bold text-white rounded hover:bg-green-700 transition">Excel</button>
          <button onClick={exportToWord} className="bg-blue-600 px-3 py-1.5 text-xs font-bold text-white rounded hover:bg-blue-700 transition">Word</button>
        </div>
    </div>

    <table className="w-full bg-white rounded-xl shadow-sm overflow-hidden border">
      <thead className="bg-gray-100 text-gray-600 text-left">
        <tr>
          <th className="p-4 text-xs font-bold uppercase">ID</th>
          <th className="p-4 text-xs font-bold uppercase">Donor</th>
          <th className="p-4 text-xs font-bold uppercase">Quantity</th>
          <th className="p-4 text-xs font-bold uppercase">Location</th>
          <th className="p-4 text-xs font-bold uppercase">Food Type</th>
          <th className="p-4 text-xs font-bold uppercase">Status</th>
        </tr>
      </thead>
      <tbody className="text-sm">
        {donations.map(d => (
          <tr key={d.id} className="border-b hover:bg-gray-50">
            <td className="p-4 font-mono">#{d.id}</td>
            <td className="p-4">{d.name}</td>
            <td className="p-4">{d.quantity} Kg</td>
            <td className="p-4 text-gray-500 truncate max-w-[200px]">{d.address}</td>
            <td className="p-4">
                <span className={`px-2 py-1 rounded text-[10px] font-bold ${d.foodType === 'Rotten' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                    {d.foodType}
                </span>
            </td>
            <td className="p-4 text-green-600 font-bold">{d.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const FertilizerBookingsTable = ({ bookings }) => (
  <div className="p-6">
    <h3 className="text-xl font-bold text-gray-700 mb-6">Fertilizer Orders Overview</h3>
    <table className="w-full bg-white rounded-xl shadow-sm border">
      <thead className="bg-blue-50 text-blue-800 text-left">
        <tr>
          <th className="p-4 text-xs font-bold uppercase">ID</th>
          <th className="p-4 text-xs font-bold uppercase">Customer</th>
          <th className="p-4 text-xs font-bold uppercase">Product</th>
          <th className="p-4 text-xs font-bold uppercase">Quantity</th>
          <th className="p-4 text-xs font-bold uppercase">Price</th>
        </tr>
      </thead>
      <tbody className="text-sm">
        {bookings.map(b => (
          <tr key={b.id} className="border-b hover:bg-blue-50/30">
            <td className="p-4 font-mono">#{b.id}</td>
            <td className="p-4 font-bold">{b.customerName}</td>
            <td className="p-4">{b.productName}</td>
            <td className="p-4">{b.quantity} Units</td>
            <td className="p-4 text-blue-600 font-bold">₹{b.totalPrice}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// --- Main NGO Panel Component ---

function NGOPanel() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({});
  const [donations, setDonations] = useState([]);
  const [acceptedDonations, setAcceptedDonations] = useState([]);
  const [fertilizerBookings, setFertilizerBookings] = useState([]);

  const navigate = useNavigate();

  // Initial load of standard data
  useEffect(() => {
    fetch('http://localhost:8080/api/ngo/donations/pending')
      .then(res => res.json())
      .then(setDonations)
      .catch(err => console.error("Error fetching pending:", err));

    fetch('http://localhost:8080/api/ngo/fertilizer-bookings')
      .then(res => res.json())
      .then(setFertilizerBookings)
      .catch(err => console.error("Error fetching fertilizer:", err));
  }, []);

  // Context-aware fetching based on tab
  useEffect(() => {
    if (activeTab === 'donations') {
      fetch('http://localhost:8080/api/ngo/donations/accepted')
        .then(res => res.json())
        .then(setAcceptedDonations);
    }
    if (activeTab === 'overview') {
      fetch('http://localhost:8080/api/ngo/stats')
        .then(res => res.json())
        .then(setStats)
        .catch(err => console.error("Error fetching stats:", err));
    }
  }, [activeTab]);

  const handleAccept = (d) => {
    fetch(`http://localhost:8080/api/ngo/donations/accept/${d.id}`, { method: 'POST' })
      .then(() => {
          alert("Donation accepted!");
          window.location.reload();
      });
  };

  const handleReject = (d) => {
    fetch(`http://localhost:8080/api/ngo/donations/reject/${d.id}`, { method: 'POST' })
      .then(() => {
          alert("Donation rejected.");
          window.location.reload();
      });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Donation Report", 14, 10);
    const tableData = acceptedDonations.map(d => [d.id, d.name, d.quantity, d.foodType, d.status]);
    doc.autoTable({ head: [['ID', 'Donor', 'Qty', 'Type', 'Status']], body: tableData });
    doc.save("donation_report.pdf");
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(acceptedDonations);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Donations");
    XLSX.writeFile(wb, "donation_report.xlsx");
  };

  const exportToWord = () => {
    const doc = new Document({
      sections: [{ 
          children: [
              new Paragraph({ text: "Donation Report", heading: "Heading1" }),
              ...acceptedDonations.map(d => new Paragraph(`ID: ${d.id} | Donor: ${d.name} | Type: ${d.foodType}`))
          ] 
      }]
    });
    Packer.toBlob(doc).then(blob => saveAs(blob, "donation_report.docx"));
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview stats={stats} />;
      case 'freshFood':
        return <DonationRequests donations={donations.filter(d => d.foodType !== 'Rotten')} onAccept={handleAccept} onReject={handleReject} />;
      case 'rottenFood':
        return <DonationRequests donations={donations.filter(d => d.foodType === 'Rotten')} onAccept={handleAccept} onReject={handleReject} />;
      case 'donations':
        return <DonationsTable donations={acceptedDonations} exportToPDF={exportToPDF} exportToExcel={exportToExcel} exportToWord={exportToWord} />;
      case 'fertilizerBooking':
        return <FertilizerBookingsTable bookings={fertilizerBookings} />;
      default:
        return <Overview stats={stats} />;
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar onSelectTab={setActiveTab} activeTab={activeTab} />
      <div className="flex-1 p-8 overflow-y-auto">
        <Topbar />
        <main>
            {renderTab()}
        </main>
      </div>
    </div>
  );
}

export default NGOPanel;