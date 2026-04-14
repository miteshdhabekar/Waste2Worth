import React, { useState, useEffect } from "react";
import axios from "axios";

const STATUS_CONFIG = {
  PENDING_PAYMENT:      { label: "Awaiting Payment",      bg: "#fff3cd", color: "#856404",  icon: "⏳" },
  PENDING_VERIFICATION: { label: "Under Verification",    bg: "#cfe2ff", color: "#084298",  icon: "🔍" },
  VERIFIED:             { label: "Verified ✓",            bg: "#d1e7dd", color: "#0f5132",  icon: "✅" },
  REJECTED:             { label: "Rejected",              bg: "#f8d7da", color: "#842029",  icon: "❌" },
};

const Badge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || { label: status, bg: "#eee", color: "#333", icon: "❓" };
  return (
    <span style={{ background: cfg.bg, color: cfg.color, padding: "0.2rem 0.7rem", borderRadius: 20, fontSize: "0.75rem", fontWeight: 700, whiteSpace: "nowrap" }}>
      {cfg.icon} {cfg.label}
    </span>
  );
};

const PaymentHistory = ({ email }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!email) return;
    axios.get(`http://localhost:8080/api/payment/history/${email}`)
      .then((r) => setPayments(r.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [email]);

  if (loading) return <div style={{ textAlign: "center", padding: "2rem", color: "#2d6a4f" }}>⏳ Loading orders…</div>;

  if (!payments.length) return (
    <div style={{ textAlign: "center", padding: "3rem", color: "#888", background: "#f6fdf7", borderRadius: 12, border: "1px dashed #b7e4c7" }}>
      <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "0.5rem" }}>🛍️</span>
      No orders yet. Visit the store to make your first purchase!
    </div>
  );

  return (
    <div>
      <h3 style={{ color: "#1b4332", marginBottom: "1.5rem", fontWeight: 700 }}>🧾 My Orders & Payments</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
        {payments.map((p) => (
          <div key={p.id} style={{ border: "1px solid #e8f5e9", borderRadius: 10, overflow: "hidden", background: "#fff" }}>
            {/* Row */}
            <div
              onClick={() => setExpanded(expanded === p.id ? null : p.id)}
              style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.9rem 1.2rem", cursor: "pointer", background: expanded === p.id ? "#f6fdf7" : "#fff" }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: "#1b4332" }}>{p.productName}</div>
                <div style={{ fontSize: "0.78rem", color: "#888" }}>
                  {p.quantity} kg · ₹{p.totalPrice} · Order #{p.id}
                </div>
              </div>
              <Badge status={p.paymentStatus} />
              <span style={{ color: "#888", fontSize: "0.8rem" }}>{expanded === p.id ? "▲" : "▼"}</span>
            </div>

            {/* Expanded details */}
            {expanded === p.id && (
              <div style={{ borderTop: "1px solid #e8f5e9", padding: "1.2rem", background: "#fafff9" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem 1.5rem", fontSize: "0.85rem", marginBottom: "1rem" }}>
                  {[
                    ["Address",      p.address],
                    ["Phone",        p.phone],
                    ["UTR / Ref No", p.utrNumber || "—"],
                    ["Order Date",   p.createdAt ? new Date(p.createdAt).toLocaleString("en-IN") : "—"],
                    ["Verified By",  p.verifiedBy || "—"],
                    ["Verified At",  p.verifiedAt ? new Date(p.verifiedAt).toLocaleString("en-IN") : "—"],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <div style={{ color: "#888", fontSize: "0.75rem" }}>{label}</div>
                      <div style={{ fontWeight: 600, color: "#222" }}>{val}</div>
                    </div>
                  ))}
                </div>

                {/* Rejection reason */}
                {p.paymentStatus === "REJECTED" && p.rejectionReason && (
                  <div style={{ background: "#fff0f0", border: "1px solid #f5c6cb", borderRadius: 8, padding: "0.7rem 1rem", color: "#721c24", fontSize: "0.85rem", marginBottom: "1rem" }}>
                    ❌ <strong>Rejection Reason:</strong> {p.rejectionReason}
                  </div>
                )}

                {/* Screenshot */}
                {p.screenshotUrl && (
                  <div>
                    <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#555", marginBottom: "0.5rem" }}>Payment Screenshot:</div>
                    <img
                      src={`http://localhost:8080${p.screenshotUrl.replace('http://localhost:8080', '')}`}
                      alt="Payment Screenshot"
                      style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 8, border: "1px solid #b7e4c7", objectFit: "contain" }}
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  </div>
                )}

                {/* Re-upload if rejected */}
                {p.paymentStatus === "REJECTED" && (
                  <div style={{ marginTop: "1rem", padding: "0.8rem", background: "#fff8e1", border: "1px solid #ffe082", borderRadius: 8, fontSize: "0.82rem", color: "#555" }}>
                    💡 Your payment was rejected. Please contact support at <strong>admin@waste2worth.com</strong> or place a new order.
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentHistory;
