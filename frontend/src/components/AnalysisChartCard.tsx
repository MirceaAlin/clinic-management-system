import React from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";

interface ChartPoint {
  date: string;
  value: number;
}

interface AnalysisChartCardProps {
  data: ChartPoint[];
}

const AnalysisChartCard: React.FC<AnalysisChartCardProps> = ({ data }) => {
  if (data.length === 0) {
    return <p className="placeholder">Nu există date pentru analiza selectată.</p>;
  }

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.15)" />
          <XAxis dataKey="date" stroke="rgba(255,255,255,0.7)" tick={{ fontSize: 12 }} />
          <YAxis stroke="rgba(255,255,255,0.7)" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              background: "rgba(15,30,50,0.95)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "12px",
              color: "#fff",
            }}
            labelStyle={{ color: "#a8ffff" }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#00ffff"
            strokeWidth={3}
            dot={{ r: 4, fill: "#00ffff" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalysisChartCard;
