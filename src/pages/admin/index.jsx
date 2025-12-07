import { useEffect, useState } from "react";
import { API } from "../../_api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend, ResponsiveContainer
} from "recharts";


// ==========================
// 🎨 CUSTOM COMPONENTS
// ==========================

// Custom Tooltip for BarChart
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border text-sm">
        <p className="font-semibold">Bulan: {payload[0].payload.bulan}</p>
        <p>Total: {payload[0].value} user</p>
      </div>
    );
  }
  return null;
};

// Custom label untuk Pie Chart
const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
  const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
  const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

  return (
    <text x={x} y={y} fill="#333" textAnchor={x > cx ? "start" : "end"} fontSize={12}>
      {(percent * 100).toFixed(0) + "%"}
    </text>
  );
};


// ==========================
// 📊 MAIN DASHBOARD
// ==========================
export default function AdminDashboard() {
  const [roleData, setRoleData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/admin/users/stat");
        setRoleData(res.data.roles);
        setMonthlyData(res.data.monthly);
      } catch (err) {
        console.error("Gagal load statistik:", err);
      }
    };

    fetchStats();
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  return (
    <div className="p-6 min-h-screen bg-gray-50">

      <h1 className="text-3xl font-bold mb-8">Dashboard Admin</h1>

      <div className="grid md:grid-cols-2 gap-8">

        {/* ================================ */}
        {/* PIE CHART */}
        {/* ================================ */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">User Berdasarkan Role</h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={roleData}
                dataKey="total"
                nameKey="role"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={CustomPieLabel}
              >
                {roleData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>


        {/* ================================ */}
        {/* BAR CHART */}
        {/* ================================ */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">User Bergabung per Bulan</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bulan" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />

              {/* BAR */}
              <Bar dataKey="total" fill="#0088FE">
                {monthlyData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}
