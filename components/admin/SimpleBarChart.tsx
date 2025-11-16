
import React from 'react';

interface BarChartData {
  label: string;
  value: number;
}

interface SimpleBarChartProps {
  data: BarChartData[];
  title: string;
}

const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ data, title }) => {
  const maxValue = Math.max(...data.map(item => item.value), 0);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
      <div className="flex justify-around items-end h-52 space-x-2">
        {data.map(item => (
          <div key={item.label} className="flex flex-col items-center flex-1 h-full">
            <div className="w-full h-full flex items-end">
                <div
                className="w-full bg-rose-400 hover:bg-rose-500 rounded-t-md transition-colors"
                style={{ height: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%` }}
                title={`${item.label}: ${item.value}`}
                />
            </div>
            <p className="text-xs text-gray-500 mt-2 whitespace-nowrap">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimpleBarChart;
