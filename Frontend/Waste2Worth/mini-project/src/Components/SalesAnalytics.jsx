import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from "recharts";

const COLORS = ["#40916c", "#74c69d", "#b7e4c7", "#52b788", "#1b4332", "#95d5b2"];

// HELPER: Fixes MySQL native query case-sensitivity (converts REVENUE/revenue to 'revenue')
const normalize = (data) => {
  if (!Array.isArray(data)) return [];
  return data.map(item => {
    const normalized = {};
    Object.keys(item).forEach(key => {
      const lowerKey = key.toLowerCase();
      // Map common DB return names to what Recharts/Table expects
      if (lowerKey === 'productname') normalized.productName = item[key];
      else if (lowerKey === 'month') normalized.month = item[key];
      else if (lowerKey === 'revenue') normalized.revenue = Number(item[key]);
      else if (lowerKey === 'quantity') normalized.quantity = Number(item[key]);
      else if (lowerKey === 'orders') normalized.orders = Number(item[key]);
      else if (lowerKey === 'date') normalized.date = item[key];
      else normalized[key] = item[key];
    });
    return normalized;
  });
};

const StatCard = ({ icon, label, value }) => (
  <div style={{
    background: "linear-gradient(135deg,#f6fdf7,#e8f5e9)", borderRadius: 12,
    padding: "1.2rem 1.5rem", border: "1px solid #b7e4c7", textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
  }}>
    <div style={{ fontSize: "2rem", marginBottom: "0.3rem" }}>{icon}</div>
    <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1b4332" }}>{value}</div>
    <div style={{ fontWeight: 600, color: "#2d6a4f", fontSize: "0.9rem" }}>{label}</div>
  </div>
);

const SalesAnalytics = () => {
  const [summary, setSummary] = useState({});
  const [monthly, setMonthly] = useState([]);
  const [products, setProducts] = useState([]);
  const [daily, setDaily] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const base = "http://localhost:8080/api/ngo/analytics";
    Promise.all([
      axios.get(`${base}/summary`),
      axios.get(`${base}/monthly-revenue`),
      axios.get(`${base}/product-sales`),
      axios.get(`${base}/daily-trend`),
    ]).then(([s, m, p, d]) => {
      // Normalize summary object keys
      const sNorm = {};
      if (s.data) Object.keys(s.data).forEach(k => sNorm[k.toLowerCase()] = s.data[k]);
      
      setSummary(sNorm);
      setMonthly(normalize(m.data));
      setProducts(normalize(p.data));
      setDaily(normalize(d.data));
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: "center", padding: "4rem" }}>Loading...</div>;

  return (
    <div>
      <h3 style={{ color: "#1b4332", fontWeight: 700, marginBottom: "1.5rem" }}>📊 Fertilizer Sales Analytics</h3>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <StatCard icon="💰" label="Total Revenue" value={`₹${Number(summary.totalrevenue || 0).toFixed(0)}`}  />
        <StatCard icon="📦" label="Total Orders" value={summary.totalorders || 0} />
        <StatCard icon="📈" label="Avg Order Value" value={`₹${Number(summary.avgordervalue || 0).toFixed(0)}`} />
        <StatCard icon="🌿" label="Top Product" value={summary.topproduct || "N/A"} />
      </div>

      {/* Monthly Chart */}
      <div style={{ background: "#fff", borderRadius: 12, padding: "1.5rem", marginBottom: "1.5rem", border: "1px solid #e8f5e9" }}>
        <h5 style={{ color: "#2d6a4f", marginBottom: "1rem" }}>📅 Monthly Revenue</h5>
        {monthly.length === 0 ? <EmptyChart /> : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#40916c" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Pie Chart */}
        <div style={{ background: "#fff", borderRadius: 12, padding: "1.5rem", border: "1px solid #e8f5e9" }}>
          <h5 style={{ color: "#2d6a4f", marginBottom: "1rem" }}>🥧 Sales Distribution</h5>
          {products.length === 0 ? <EmptyChart /> : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={products} dataKey="revenue" nameKey="productName" cx="50%" cy="50%" outerRadius={80}>
                  {products.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bar Chart */}
        <div style={{ background: "#fff", borderRadius: 12, padding: "1.5rem", border: "1px solid #e8f5e9" }}>
          <h5 style={{ color: "#2d6a4f", marginBottom: "1rem" }}>📆 Daily Trend</h5>
          {daily.length === 0 ? <EmptyChart /> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={daily}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#74c69d" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

const EmptyChart = () => <div style={{ textAlign: "center", padding: "2rem", color: "#888" }}>No data found.</div>;

export default SalesAnalytics;