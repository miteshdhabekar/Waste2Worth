import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const { state }  = useLocation();
  const navigate   = useNavigate();

  if (!state) { navigate("/store"); return null; }

  const { productName, quantity, totalPrice, email, bookingId, utrNumber } = state;

  return (
    <div style={{ minHeight: "100vh", background: "#f0f5f1", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.10)", maxWidth: 500, width: "100%", padding: "2.5rem", textAlign: "center" }}>

        {/* Icon */}
        <div style={{ width: 80, height: 80, background: "linear-gradient(135deg,#40916c,#1b4332)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: "2.2rem" }}>
          ⏳
        </div>

        <h2 style={{ color: "#1b4332", fontWeight: 800, fontSize: "1.7rem", marginBottom: "0.5rem" }}>
          Proof Submitted!
        </h2>
        <p style={{ color: "#555", fontSize: "0.92rem", marginBottom: "2rem", lineHeight: 1.6 }}>
          Your payment screenshot has been uploaded. Our team will verify it shortly and confirm your order. You'll be notified at <strong>{email}</strong>.
        </p>

        {/* Status timeline */}
        <div style={{ textAlign: "left", background: "#f6fdf7", border: "1px solid #b7e4c7", borderRadius: 10, padding: "1.2rem", marginBottom: "1.5rem" }}>
          {[
            { done: true,  icon: "✅", label: "Order Placed",        sub: `Booking #${bookingId}` },
            { done: true,  icon: "✅", label: "Payment Screenshot Uploaded", sub: `UTR: ${utrNumber}` },
            { done: false, icon: "⏳", label: "Verification Pending",  sub: "Admin/NGO is reviewing your payment" },
            { done: false, icon: "📦", label: "Order Confirmed",       sub: "You'll receive an email once verified" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "0.9rem", marginBottom: i < 3 ? "0.9rem" : 0, alignItems: "flex-start" }}>
              <span style={{ fontSize: "1.1rem", minWidth: 24 }}>{item.icon}</span>
              <div>
                <div style={{ fontWeight: 700, color: item.done ? "#1b4332" : "#888", fontSize: "0.9rem" }}>{item.label}</div>
                <div style={{ fontSize: "0.78rem", color: "#888" }}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Order details */}
        <div style={{ background: "#f9f9f9", borderRadius: 10, padding: "1rem", marginBottom: "1.5rem", textAlign: "left", fontSize: "0.88rem" }}>
          {[["Product", productName], ["Qty", `${quantity} kg`], ["Amount", `₹${totalPrice}`]].map(([l, v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
              <span style={{ color: "#666" }}>{l}</span>
              <span style={{ fontWeight: 700, color: "#222" }}>{v}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "0.8rem" }}>
          <button onClick={() => navigate("/store")} style={{ flex: 1, padding: "0.8rem", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#40916c,#1b4332)", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
            🛒 Shop More
          </button>
          <button onClick={() => navigate("/userdash")} style={{ flex: 1, padding: "0.8rem", borderRadius: 10, border: "1px solid #b7e4c7", background: "transparent", color: "#2d6a4f", fontWeight: 700, cursor: "pointer" }}>
            📋 My Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
