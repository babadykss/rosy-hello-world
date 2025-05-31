
import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../LoadingSpinner';

interface ScreenshotsProps {
  agentId: string | null;
}

const Screenshots: React.FC<ScreenshotsProps> = ({ agentId }) => {
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<'full' | 'viewport' | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [agentId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-8 bg-black text-green-400 font-mono">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-green-400 terminal-text mb-2">
          ┌─[ SCREENSHOTS CAPTURE ]
        </h1>
        <div className="text-cyan-400 text-sm">
          │ Full page and viewport capture<br />
          └─ Element-specific targeting
        </div>
      </div>
      
      <div className="flex gap-8">
        <div className="flex-1">
          <div className="border border-green-400 p-4 mb-8 bg-black">
            <div className="text-green-400 mb-4">┌─[ CAPTURE TYPE SELECTION ]</div>
            <div className="grid grid-cols-2 gap-6">
              <div 
                onClick={() => setSelectedType('full')}
                className={`
                  w-40 h-40 border border-green-400 bg-black flex flex-col items-center justify-center cursor-pointer transition-colors
                  ${selectedType === 'full' ? 'bg-green-400 text-black' : 'hover:bg-green-400/20'}
                `}
              >
                <div className="w-8 h-8 border border-current mb-2 flex items-center justify-center">
                  <span>📷</span>
                </div>
                <span className="text-sm font-bold">FULL PAGE</span>
              </div>
              
              <div 
                onClick={() => setSelectedType('viewport')}
                className={`
                  w-40 h-40 border border-green-400 bg-black flex flex-col items-center justify-center cursor-pointer transition-colors
                  ${selectedType === 'viewport' ? 'bg-green-400 text-black' : 'hover:bg-green-400/20'}
                `}
              >
                <div className="w-8 h-8 border border-current mb-2 flex items-center justify-center">
                  <span>📷</span>
                </div>
                <span className="text-sm font-bold">VIEWPORT</span>
              </div>
            </div>
            <div className="text-green-600 text-xs mt-4">└─[ SELECT CAPTURE TYPE ]</div>
          </div>
          
          <div className="border border-green-400 p-4 bg-black">
            <div className="text-green-400 mb-4">┌─[ ELEMENT-SPECIFIC CAPTURE ]</div>
            <label className="block text-green-400 mb-2">│ CSS Selector:</label>
            <select className="bg-black border border-green-400 text-green-400 px-4 py-2 focus:outline-none focus:border-cyan-400 transition-colors w-full font-mono">
              <option>► Select CSS selector</option>
              <option>body</option>
              <option>.header</option>
              <option>#main-content</option>
              <option>.sidebar</option>
            </select>
            <div className="text-green-600 text-xs mt-2">└─[ SELECTOR CONFIGURED ]</div>
          </div>
        </div>
        
        {selectedType && (
          <div className="w-96 border border-green-400 bg-black">
            <div className="bg-green-400 text-black px-4 py-2 font-bold">
              ┌─[ {selectedType === 'full' ? 'FULL PAGE' : 'VIEWPORT'} PREVIEW ]
            </div>
            <div className="p-4">
              <div className="w-full h-64 border border-green-400 bg-black flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 border border-green-400 mx-auto mb-2 animate-pulse"></div>
                  <p className="text-green-400 text-sm">► Screenshot preview</p>
                </div>
              </div>
            </div>
            <div className="bg-green-400 text-black px-4 py-2 text-xs">
              └─[ PREVIEW READY ]
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Screenshots;
