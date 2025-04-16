
import React from "react";
import { ChartData } from "@/lib/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface WorkoutCaloriesChartProps {
  data: ChartData[];
}

const WorkoutCaloriesChart: React.FC<WorkoutCaloriesChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12, fill: '#888' }}
          axisLine={{ stroke: '#eee' }}
          tickLine={false}
        />
        <YAxis 
          tick={{ fontSize: 12, fill: '#888' }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip
          contentStyle={{ 
            backgroundColor: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            padding: '10px'
          }}
          labelStyle={{ fontWeight: 'bold', marginBottom: '5px' }}
          formatter={(value: number) => [`${value} cal`, 'Calories']}
        />
        <Bar 
          dataKey="value" 
          fill="#9b87f5" 
          radius={[4, 4, 0, 0]}
          barSize={30}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default WorkoutCaloriesChart;
