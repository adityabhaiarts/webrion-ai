import React from "react";
import { Check } from "lucide-react";

interface PasswordStrengthMeterProps {
  password?: string;
}

export function PasswordStrengthMeter({ password = "" }: PasswordStrengthMeterProps) {
  const reqs = [
    { label: "8+ characters", valid: password.length >= 8 },
    { label: "Uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "Lowercase letter", valid: /[a-z]/.test(password) },
    { label: "Number", valid: /[0-9]/.test(password) },
    { label: "Special character", valid: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <div className="bg-white/5 border border-white/10 p-4 rounded-lg mt-2">
      <div className="text-xs font-semibold text-gray-300 mb-2">Password Requirements</div>
      <div className="grid grid-cols-2 gap-2">
        {reqs.map((r, i) => (
          <div key={i} className={`text-xs flex items-center gap-1 ${r.valid ? 'text-brand-400' : 'text-gray-500'}`}>
            <Check className="w-3 h-3" /> {r.label}
          </div>
        ))}
      </div>
    </div>
  );
}
