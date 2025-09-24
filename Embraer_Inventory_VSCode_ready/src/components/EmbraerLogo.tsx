import React from 'react';
import { Plane } from 'lucide-react';

const EmbraerLogo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
        <Plane className="w-5 h-5 text-white" />
      </div>
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          EMBRAER
        </h1>
        <p className="text-xs text-blue-600 uppercase tracking-wider">Aviation Excellence</p>
      </div>
    </div>
  );
};

export default EmbraerLogo;