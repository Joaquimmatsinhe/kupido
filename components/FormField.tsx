
import React from 'react';

interface FormFieldProps {
  label: string;
  isEditing: boolean;
  displayValue: string | number | React.ReactNode;
  children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({ label, isEditing, displayValue, children }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
      {isEditing ? (
        children
      ) : (
        <p className="text-gray-900 bg-gray-50 p-3 rounded-md min-h-[44px]">{displayValue}</p>
      )}
    </div>
  );
};

export default FormField;
