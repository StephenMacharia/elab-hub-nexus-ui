import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export function StatusPieChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="status" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function StatusBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="status" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function StatusDonutChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="status" cx="50%" cy="50%" innerRadius={50} outerRadius={80} fill="#82ca9d" label>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
