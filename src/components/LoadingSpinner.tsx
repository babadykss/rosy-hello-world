
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="text-green-400 mb-4 font-mono">
          ╔═════════════════════╗<br />
          ║                     ║<br />
          ║      LOADING...     ║<br />
          ║                     ║<br />
          ╚═════════════════════╝
        </div>
        <div className="flex items-center justify-center space-x-1 text-cyan-400">
          <span className="animate-pulse">●</span>
          <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>●</span>
          <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>●</span>
        </div>
        <div className="text-green-600 text-xs mt-2">
          Accessing secure data...
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
