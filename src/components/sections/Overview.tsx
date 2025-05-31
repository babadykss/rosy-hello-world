
import React, { useState, useEffect } from 'react';
import { useAgentData } from '../../contexts/AgentDataContext';
import LoadingSpinner from '../LoadingSpinner';

interface OverviewProps {
  agentId: string | null;
}

const Overview: React.FC<OverviewProps> = ({ agentId }) => {
  const { getAgentData, hasError } = useAgentData();
  const [loading, setLoading] = useState(true);
  
  const overviewData = agentId ? getAgentData(agentId, 'overview') : null;
  const error = agentId ? hasError(agentId, 'overview') : null;

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
          <span className="text-red-400">ERROR:</span> Error loading Overview: {error}
        </div>
      </div>
    );
  }

  if (!overviewData) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-green-600 mb-4">
            ╔═══════════════════════════════╗<br />
            ║                               ║<br />
            ║        NO DATA AVAILABLE      ║<br />
            ║                               ║<br />
            ║   Waiting for extension to    ║<br />
            ║   send overview data...       ║<br />
            ║                               ║<br />
            ╚═══════════════════════════════╝
          </div>
          <p className="text-green-400 text-sm">← Extension data pending</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-green-400 mb-2 terminal-text">
          ┌─[ OVERVIEW ]─[ AGENT: {agentId} ]
        </h1>
        <div className="text-cyan-400 text-sm">
          ├─ General agent information<br />
          └─ System status and metrics
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-black border border-green-400 p-6 terminal-glow">
          <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center">
            <span className="mr-2">▣</span> SYSTEM STATUS
          </h3>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex justify-between">
              <span className="text-green-600">Status:</span>
              <span className="text-green-400">● {overviewData.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-600">Last Ping:</span>
              <span className="text-green-400">{overviewData.lastPing}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-600">CPU Load:</span>
              <span className="text-cyan-400">{overviewData.cpuLoad}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-600">RAM Usage:</span>
              <span className="text-cyan-400">{overviewData.ramUsage}</span>
            </div>
            <div className="mt-4 text-xs text-green-600">
              ═══════════════════════════<br />
              [████████░░] 67% Efficiency
            </div>
          </div>
        </div>

        <div className="bg-black border border-green-400 p-6 terminal-glow">
          <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center">
            <span className="mr-2">◉</span> HOST INFORMATION
          </h3>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex justify-between">
              <span className="text-green-600">Hostname:</span>
              <span className="text-green-400">{overviewData.hostname}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-600">OS:</span>
              <span className="text-green-400">{overviewData.os}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-600">Browser:</span>
              <span className="text-green-400">{overviewData.browser}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-600">IP Address:</span>
              <span className="text-cyan-400">{overviewData.ipAddress}</span>
            </div>
            <div className="mt-4 text-xs text-green-600">
              ═══════════════════════════<br />
              Geolocation: New York, US
            </div>
          </div>
        </div>

        <div className="bg-black border border-green-400 p-6 terminal-glow md:col-span-2">
          <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center">
            <span className="mr-2">◧</span> RECENT COMMANDS
          </h3>
          <div className="space-y-2 font-mono text-sm">
            <div className="text-green-600">
              ┌─[ COMMAND HISTORY ]─[ LAST {overviewData.commands?.length || 0} ENTRIES ]
            </div>
            <div className="ml-4 space-y-1">
              {overviewData.commands?.map((cmd, index) => (
                <div key={index} className="flex">
                  <span className="text-green-600 mr-2">{cmd.time}</span>
                  <span className="text-cyan-400 mr-2">→</span>
                  <span className="text-green-400">{cmd.command}</span>
                </div>
              ))}
            </div>
            <div className="text-green-600 mt-2">
              └─[ END OF LOG ]
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
