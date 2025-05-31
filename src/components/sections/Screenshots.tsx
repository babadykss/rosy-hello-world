
import React, { useState, useEffect } from 'react';
import { useAgentData } from '../../contexts/AgentDataContext';
import LoadingSpinner from '../LoadingSpinner';

interface ScreenshotsProps {
  agentId: string | null;
}

interface Screenshot {
  timestamp: string;
  filename: string;
  size: string;
  base64: string;
}

const Screenshots: React.FC<ScreenshotsProps> = ({ agentId }) => {
  const { getAgentData, hasError } = useAgentData();
  const [loading, setLoading] = useState(true);
  const [selectedScreenshot, setSelectedScreenshot] = useState<Screenshot | null>(null);

  const screenshotsData = agentId ? getAgentData(agentId, 'screenshots') : null;
  const error = agentId ? hasError(agentId, 'screenshots') : null;

  useEffect(() => {
    if (agentId) {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [agentId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="border border-red-400 p-4 bg-red-400/10 mb-6">
          <span className="text-red-400">ERROR:</span> Error loading Screenshots: {error}
        </div>
      </div>
    );
  }

  if (!screenshotsData || !Array.isArray(screenshotsData) || screenshotsData.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-green-600 mb-4">
            ╔═══════════════════════════════╗<br />
            ║                               ║<br />
            ║       NO SCREENSHOTS          ║<br />
            ║                               ║<br />
            ║   Waiting for extension to    ║<br />
            ║   capture screenshots...      ║<br />
            ║                               ║<br />
            ╚═══════════════════════════════╝
          </div>
          <p className="text-green-400 text-sm">← Screenshots pending</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-black text-green-400 font-mono">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-green-400 terminal-text mb-2">
          ┌─[ SCREENSHOTS CAPTURE ]
        </h1>
        <div className="text-cyan-400 text-sm">
          │ Real-time screen capture<br />
          └─ Agent viewport monitoring
        </div>
      </div>
      
      <div className="flex gap-8">
        <div className="flex-1">
          <div className="border border-green-400 p-4 mb-8 bg-black">
            <div className="text-green-400 mb-4">┌─[ AVAILABLE SCREENSHOTS ]</div>
            <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {screenshotsData.map((screenshot: Screenshot, index: number) => (
                <div 
                  key={index}
                  onClick={() => setSelectedScreenshot(screenshot)}
                  className={`
                    border border-green-400 bg-black cursor-pointer transition-colors p-4
                    ${selectedScreenshot === screenshot ? 'bg-green-400 text-black' : 'hover:bg-green-400/20'}
                  `}
                >
                  <div className="text-sm font-bold mb-2">{screenshot.filename}</div>
                  <div className="text-xs opacity-70">{screenshot.timestamp}</div>
                  <div className="text-xs opacity-70">{screenshot.size}</div>
                  <div className="mt-2 w-full h-20 border border-current overflow-hidden">
                    <img 
                      src={screenshot.base64} 
                      alt={screenshot.filename}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="text-green-600 text-xs mt-4">└─[ {screenshotsData.length} SCREENSHOTS AVAILABLE ]</div>
          </div>
        </div>
        
        {selectedScreenshot && (
          <div className="w-96 border border-green-400 bg-black">
            <div className="bg-green-400 text-black px-4 py-2 font-bold">
              ┌─[ SCREENSHOT PREVIEW ]
            </div>
            <div className="p-4">
              <div className="mb-4">
                <div className="text-green-400 text-sm mb-2">
                  │ Filename: {selectedScreenshot.filename}<br />
                  │ Timestamp: {selectedScreenshot.timestamp}<br />
                  │ Size: {selectedScreenshot.size}<br />
                  └─ Click to view full size
                </div>
              </div>
              <div className="w-full border border-green-400 bg-black">
                <img 
                  src={selectedScreenshot.base64} 
                  alt={selectedScreenshot.filename}
                  className="w-full h-auto cursor-pointer"
                  onClick={() => window.open(selectedScreenshot.base64, '_blank')}
                />
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
