
import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: string;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, change, changeType = 'neutral' }) => {
  const changeColor = {
    increase: 'text-green-600',
    decrease: 'text-red-600',
    neutral: 'text-gray-500',
  }[changeType];
  
  const iconBgColor = {
    increase: 'bg-green-100',
    decrease: 'bg-red-100',
    neutral: 'bg-gray-100',
  }[changeType];

  const changeIcon = {
    increase: 'fa-arrow-up',
    decrease: 'fa-arrow-down',
    neutral: ''
  }[changeType];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBgColor}`}>
        <i className={`fa-solid ${icon} text-xl text-gray-600`}></i>
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        {change && (
          <p className={`text-sm font-semibold ${changeColor} mt-1`}>
            {changeIcon && <i className={`fa-solid ${changeIcon} mr-1`}></i>}
            {change}
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
