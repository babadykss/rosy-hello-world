
import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../LoadingSpinner';

interface SystemReconProps {
  agentId: string | null;
}

const SystemRecon: React.FC<SystemReconProps> = ({ agentId }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [agentId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const reconCategories = [
    {
      title: 'Browser Environment Profiling',
      icon: '🌐',
      status: 'COMPLETED',
      details: 'User-Agent, Plugins, Extensions'
    },
    {
      title: 'Extension Enumeration',
      icon: '🧩',
      status: 'COMPLETED', 
      details: 'Installed Extensions, Permissions'
    },
    {
      title: 'Hardware Capability Assessment',
      icon: '💻',
      status: 'COMPLETED',
      details: 'CPU, GPU, Memory, Storage'
    },
    {
      title: 'Network Configuration Analysis',
      icon: '🌐',
      status: 'COMPLETED',
      details: 'IP, DNS, Proxy Settings'
    },
    {
      title: 'GPU Information Gathering',
      icon: '🎮',
      status: 'COMPLETED',
      details: 'Graphics Cards, WebGL Support'
    }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-green-400 mb-2 terminal-text">
          ┌─[ SYSTEM RECONNAISSANCE ]─[ AGENT: {agentId} ]
        </h1>
        <div className="text-cyan-400 text-sm">
          ├─ Browser environment profiling<br />
          ├─ Extension enumeration<br />
          ├─ Hardware capability assessment<br />
          ├─ Network configuration analysis<br />
          └─ GPU information gathering
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reconCategories.map((category, index) => (
          <div
            key={index}
            className="bg-black border border-green-400 p-6 hover:bg-green-400/10 transition-colors cursor-pointer terminal-glow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <span className="text-2xl mr-4">{category.icon}</span>
                <div>
                  <h3 className="text-lg font-bold text-green-400">
                    {index + 1 < 10 ? `0${index + 1}` : index + 1}. {category.title}
                  </h3>
                  <div className="text-xs text-green-600">{category.details}</div>
                </div>
              </div>
              <div className="text-xs">
                <span className="text-green-400">● {category.status}</span>
              </div>
            </div>
            
            <div className="border-t border-green-600 pt-3">
              <div className="text-xs text-green-600 font-mono">
                ┌─[ SCAN RESULTS ]<br />
                ├─ Items Found: {Math.floor(Math.random() * 50) + 10}<br />
                ├─ Last Scan: {new Date().toLocaleString()}<br />
                └─ Status: READY
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 bg-black border border-green-400 p-6 terminal-glow">
        <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center">
          <span className="mr-2">◭</span> RECONNAISSANCE SUMMARY
        </h3>
        <div className="font-mono text-sm space-y-2">
          <div className="text-green-600">
            ╔═══════════════════════════════════════════════════════════════════╗<br />
            ║  RECON TYPE           │  STATUS      │  ITEMS   │  LAST UPDATED    ║<br />
            ╠═══════════════════════════════════════════════════════════════════╣
          </div>
          <div className="text-green-400">
            ║  Browser Environment  │  ● COMPLETE  │    24    │  15:42:33        ║<br />
            ║  Extensions          │  ● COMPLETE  │    12    │  15:41:12        ║<br />
            ║  Hardware Info       │  ● COMPLETE  │    18    │  15:39:45        ║<br />
            ║  Network Config      │  ● COMPLETE  │     8    │  15:38:21        ║<br />
            ║  GPU Information     │  ● COMPLETE  │     6    │  15:37:09        ║
          </div>
          <div className="text-green-600">
            ╚═══════════════════════════════════════════════════════════════════╝<br />
            Total reconnaissance items: 68 • All scans completed successfully
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemRecon;
