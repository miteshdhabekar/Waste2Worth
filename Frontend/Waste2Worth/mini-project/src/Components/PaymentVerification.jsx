import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const STATUS_CONFIG = {
  PENDING_VERIFICATION: { label: "Needs Review", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-100", icon: "🔍", color: "blue" },
  COMPLETED:            { label: "Verified",    bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100", icon: "✅", color: "emerald" }, 
  REJECTED:             { label: "Rejected",    bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-100", icon: "❌", color: "rose" },
};

const PaymentVerification = ({ verifierName = "Admin" }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("PENDING_VERIFICATION");
  const [selectedId, setSelectedId] = useState(null); 
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const r = await axios.get("http://localhost:8080/admin/payments/all");
      // Safety check: ensure r.data is an array
      setBookings(Array.isArray(r.data) ? r.data : []);
    } catch (e) {
      console.error("Fetch Error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    fetchBookings(); 
  }, [fetchBookings]);

  // FIX: Updated counts logic to handle potential snake_case from DB
  const counts = bookings.reduce((acc, b) => {
    const status = b.paymentStatus || b.payment_status; 
    if (status && acc[status] !== undefined) acc[status]++;
    return acc;
  }, { PENDING_VERIFICATION: 0, COMPLETED: 0, REJECTED: 0 });

  const handleAction = async (id, type) => {
    const isApprove = type === 'verify';
    if (!isApprove && !rejectReason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }

    setActionLoading(true);
    try {
      const url = `http://localhost:8080/admin/verify/${id}`;
      // verifierName is passed to help with the 'verified_by' DB column
      const params = { 
        approve: isApprove, 
        reason: isApprove ? "" : rejectReason,
        verifierName: verifierName 
      };
      
      const res = await axios.post(url, null, { params });
      
      alert(typeof res.data === 'string' ? res.data : "Action successful");
      setRejectReason("");
      setSelectedId(null);
      
      // Auto-switch tab so admin sees the result
      setActiveTab(isApprove ? "COMPLETED" : "REJECTED");
      fetchBookings(); 
    } catch (e) {
      alert("Action failed. Check console for details.");
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  // FIX: Filter logic now accounts for both camelCase and snake_case
  const filtered = bookings.filter((b) => (b.paymentStatus || b.payment_status) === activeTab);
  
  const getImageUrl = (url) => {
    if (!url) return null;
    return url.startsWith("http") ? url : `http://localhost:8080${url}`;
  };

  return (
  <div className="p-6 max-w-6xl mx-auto space-y-6 bg-slate-50 min-h-screen">
    
    {/* HEADER */}
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-2xl font-semibold text-slate-800">
          Payment Verification
        </h3>
        <p className="text-sm text-slate-500">
          Manage and verify fertilizer payment submissions
        </p>
      </div>
    </div>

    {/* TABS */}
    <div className="flex gap-2 border-b border-slate-200">
      {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
        <button
          key={key}
          onClick={() => {
            setActiveTab(key);
            setSelectedId(null);
          }}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-all
            ${
              activeTab === key
                ? `border-${cfg.color}-600 text-${cfg.color}-700`
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
        >
          {cfg.label} ({counts[key] || 0})
        </button>
      ))}
    </div>

    {/* CONTENT */}
    <div className="space-y-3">
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-sm">
          Loading...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-slate-400 text-sm bg-white border rounded-lg">
          No records found
        </div>
      ) : (
        filtered.map((b) => (
          <div
            key={b.id}
            className="bg-white border border-slate-200 rounded-lg"
          >
            {/* ROW */}
            <div
              className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-50"
              onClick={() =>
                setSelectedId(selectedId === b.id ? null : b.id)
              }
            >
              <div>
                <p className="font-medium text-slate-800">
                  {b.customerName || b.customer_name}
                </p>
                <p className="text-xs text-slate-500">
                  {b.productName || b.product_name} • Qty: {b.quantity} • ₹
                  {b.totalPrice || b.total_price}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded border ${STATUS_CONFIG[activeTab].border} ${STATUS_CONFIG[activeTab].text} ${STATUS_CONFIG[activeTab].bg}`}
                >
                  {STATUS_CONFIG[activeTab].label}
                </span>

                <span className="text-slate-400 text-xs">
                  #{b.id}
                </span>
              </div>
            </div>

            {/* EXPAND */}
            {selectedId === b.id && (
              <div className="border-t p-4 grid md:grid-cols-2 gap-6 text-sm">
                
                {/* LEFT */}
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-400">Contact</p>
                    <p>{b.phone}</p>
                    <p className="text-slate-500">{b.email}</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Address</p>
                    <p>{b.address}</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Date</p>
                    <p>
                      {b.createdAt || b.created_at
                        ? new Date(
                            b.createdAt || b.created_at
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>

                  {(b.rejectionReason || b.rejection_reason) && (
                    <div className="p-3 border border-rose-200 bg-rose-50 rounded">
                      <p className="text-xs text-rose-500">
                        Rejection Reason
                      </p>
                      <p className="text-rose-700">
                        {b.rejectionReason || b.rejection_reason}
                      </p>
                    </div>
                  )}

                  {activeTab === "PENDING_VERIFICATION" && (
                    <div className="space-y-2 pt-2">
                      <textarea
                        className="w-full border rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Rejection reason..."
                        value={rejectReason}
                        onChange={(e) =>
                          setRejectReason(e.target.value)
                        }
                      />

                      {/* Change the button section to this: */}
<div className="flex gap-2">
  <button 
    type="button"
    onClick={() => handleAction(b.id, 'verify')} // CALL APPROVE
    disabled={actionLoading}
    className="flex-1 bg-slate-800 text-white py-2 rounded text-sm hover:bg-slate-900 disabled:opacity-50"
  >
    {actionLoading ? "Processing..." : "Approve"}
  </button>
  
  <button 
    type="button"
    onClick={() => handleAction(b.id, 'reject')} // CALL REJECT
    disabled={actionLoading}
    className="flex-1 border border-slate-300 py-2 rounded text-sm hover:bg-slate-100 disabled:opacity-50"
  >
    Reject
  </button>
</div>
                    </div>
                  )}
                </div>

                {/* RIGHT */}
                <div>
                  <p className="text-xs text-slate-400 mb-2">
                    Screenshot
                  </p>

                  {(b.screenshotUrl || b.screenshot_url) ? (
                    <img
                      src={getImageUrl(
                        b.screenshotUrl || b.screenshot_url
                      )}
                      className="border rounded w-full max-h-64 object-contain bg-white"
                      alt="Proof"
                    />
                  ) : (
                    <div className="h-40 border rounded flex items-center justify-center text-slate-400 text-xs">
                      No Image
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  </div>
);
};

export default PaymentVerification;