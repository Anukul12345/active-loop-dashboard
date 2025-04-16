
import React from "react";
import { ChartData } from "@/lib/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface WorkoutTypeChartProps {
  data: ChartData[];
}

// Chart colors for different workout types
const COLORS = ['#9b87f5', '#7E69AB', '#6E59A5', '#4ADE80', '#FFA500', '#FF4D4F', '#33C3F0'];

const WorkoutTypeChart: React.FC<WorkoutTypeChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ 
            backgroundColor: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            padding: '10px'
          }}
          formatter={(value: number, name: string, props: any) => [
            `${value} workout${value !== 1 ? 's' : ''}`, props.payload.name
          ]}
        />
        <Legend 
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          formatter={(value, entry, index) => (
            <span className="text-sm text-gray-700">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default WorkoutTypeChart;
