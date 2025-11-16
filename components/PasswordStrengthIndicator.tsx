import React, { useMemo } from 'react';

interface PasswordStrengthIndicatorProps {
  password?: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password = '' }) => {
  const strength = useMemo(() => {
    let score = 0;
    if (password.length > 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  }, [password]);

  const strengthLabel = ['Fraca', 'Razoável', 'Boa', 'Forte', 'Muito Forte'][strength];
  const strengthColor = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-green-400',
    'bg-green-600',
  ][strength];

  if (!password) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-300 ${strengthColor}`}
          style={{ width: `${(strength / 4) * 100}%` }}
        ></div>
      </div>
      <span className="text-sm text-gray-600 font-medium whitespace-nowrap">{strengthLabel}</span>
    </div>
  );
};

export default PasswordStrengthIndicator;