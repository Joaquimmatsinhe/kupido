import React from 'react';

interface ToggleSwitchProps {
  id: string;
  checked: boolean;
  onChange: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ id, checked, onChange }) => {
  return (
    <label htmlFor={id} className="inline-flex items-center cursor-pointer">
      <span className="relative">
        <input id={id} type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
        <div className={`block w-14 h-8 rounded-full transition ${checked ? 'bg-rose-500' : 'bg-gray-300'}`}></div>
        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${checked ? 'transform translate-x-6' : ''}`}></div>
      </span>
    </label>
  );
};

export default ToggleSwitch;
