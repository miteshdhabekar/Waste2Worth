import React, { useState, useEffect } from "react";
import axios from "axios";

const MEDAL = ["🥇", "🥈", "🥉"];
const MEDAL_BG = ["#fffbe6", "#f5f5f5", "#fff4e6"];
const MEDAL_BORDER = ["#f6c90e", "#c0c0c0", "#cd7f32"];

const LeaderboardTable = ({ data, loading }) => {
  if (loading) return <div className="text-center py-10 text-emerald-700 font-bold">⏳ Fetching Leaderboard...</div>;
  
  if (!data || data.length === 0) return (
    <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed">
      No completed orders found in the database. 🌱
    </div>
  );

  return (
    <div className="space-y-3">
      {data.map((buyer, i) => {
        // Fallback logic to handle DB naming (snake_case or lowercase)
        const name = buyer.name || buyer.customer_name || "Anonymous";
        const email = buyer.email || "No Email";
        const totalSpent = buyer.totalspent || buyer.totalSpent || buyer.total_price || 0;
        const totalKg = buyer.totalkg || buyer.totalKg || buyer.quantity || 0;
        const orderCount = buyer.ordercount || buyer.orderCount || 1;

        return (
          <div
            key={i}
            className="flex items-center gap-4 p-4 rounded-xl transition-all border"
            style={{
              background: i < 3 ? MEDAL_BG[i] : "#fff",
              borderColor: i < 3 ? MEDAL_BORDER[i] : "#f1f5f9",
            }}
          >
            {/* Rank */}
            <div className="w-10 text-center font-black text-xl text-slate-600">
              {i < 3 ? MEDAL[i] : `#${i + 1}`}
            </div>

            {/* Avatar */}
            <div className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-lg shadow-sm"
                 style={{ background: `hsl(${(i * 137) % 360}, 65%, 50%)` }}>
              {name[0].toUpperCase()}
            </div>

            {/* Buyer Details */}
            <div className="flex-1 min-w-0">
              <div className="font-bold text-slate-800 truncate text-base">{name}</div>
              <div className="text-xs text-slate-400 truncate">{email}</div>
            </div>

            {/* Database Stats */}
            <div className="text-right">
              <div className="font-black text-emerald-600 text-lg">₹{totalSpent}</div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {totalKg}kg • {orderCount} Orders
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Leaderboard = ({ compact = false }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ensure this URL exactly matches your AdminController mapping
    axios.get("http://localhost:8080/admin/leaderboard/buyers")
      .then((r) => {
        console.log("Database response:", r.data); // Helpful for debugging
        setData(r.data || []);
      })
      .catch((err) => console.error("Database fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={`bg-white rounded-3xl p-6 ${compact ? '' : 'shadow-xl border border-slate-100 max-w-2xl mx-auto'}`}>
      {!compact && (
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-emerald-50 rounded-2xl mb-3">
             <span className="text-3xl">🏆</span>
          </div>
          <h3 className="text-2xl font-black text-slate-800">Top Buyers</h3>
          <p className="text-slate-500 text-sm mt-1">Real-time data from verified purchases</p>
        </div>
      )}

      <LeaderboardTable data={data} loading={loading} />
    </div>
  );
};

export default Leaderboard;