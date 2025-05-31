
import React, { useState, useEffect } from 'react';
import { useAgentData } from '../../contexts/AgentDataContext';
import LoadingSpinner from '../LoadingSpinner';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface HistoryProps {
  agentId: string | null;
}

interface HistoryItem {
  url: string;
  title: string;
  timestamp: string;
  type: string;
}

const History: React.FC<HistoryProps> = ({ agentId }) => {
  const { getAgentData, hasError } = useAgentData();
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState('2024-05-01');
  const [toDate, setToDate] = useState('2024-05-31');

  const historyData = agentId ? getAgentData(agentId, 'history') : null;
  const error = agentId ? hasError(agentId, 'history') : null;

  useEffect(() => {
    if (agentId) {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [agentId]);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const handleApply = () => {
    setLoading(true);
    console.log(`Applying date filter: ${fromDate} to ${toDate}`);
    setTimeout(() => setLoading(false), 1500);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="border border-red-400 p-4 bg-red-400/10 mb-6">
          <span className="text-red-400">ERROR:</span> Error loading History: {error}
        </div>
      </div>
    );
  }

  if (!historyData || !Array.isArray(historyData) || historyData.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-green-600 mb-4">
            ╔═══════════════════════════════╗<br />
            ║                               ║<br />
            ║        NO HISTORY DATA        ║<br />
            ║                               ║<br />
            ║   Waiting for extension to    ║<br />
            ║   send history data...        ║<br />
            ║                               ║<br />
            ╚═══════════════════════════════╝
          </div>
          <p className="text-green-400 text-sm">← History data pending</p>
        </div>
      </div>
    );
  }

  // Generate chart data from history
  const domainCounts: { [key: string]: number } = {};
  historyData.forEach((item: HistoryItem) => {
    try {
      const domain = new URL(item.url).hostname;
      domainCounts[domain] = (domainCounts[domain] || 0) + 1;
    } catch (e) {
      // Invalid URL, skip
    }
  });

  const chartData = Object.entries(domainCounts)
    .map(([site, visits]) => ({ site, visits, fill: '#00ff00' }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 5);

  const chartConfig = {
    visits: {
      label: "Visits",
    },
  };

  return (
    <div className="p-8 bg-black text-green-400 font-mono">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-green-400 terminal-text mb-2">
            ┌─[ BROWSING HISTORY DATA ]
          </h1>
          <div className="text-cyan-400 text-sm">
            │ Configurable date-range collection<br />
            └─ Visit frequency analytics
          </div>
        </div>
        <button 
          onClick={handleRefresh}
          className="border border-green-400 text-green-400 px-4 py-2 hover:bg-green-400 hover:text-black transition-colors bg-transparent"
        >
          ► REFRESH
        </button>
      </div>
      
      <div className="border border-green-400 p-4 mb-8 bg-black">
        <div className="text-green-400 mb-4">┌─[ DATE RANGE FILTER ]</div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <label className="text-green-400">│ From:</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-black border border-green-400 text-green-400 px-3 py-2 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-green-400">To:</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-black border border-green-400 text-green-400 px-3 py-2 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
            />
          </div>
          <button 
            onClick={handleApply}
            className="border border-green-400 text-green-400 px-6 py-2 hover:bg-green-400 hover:text-black transition-colors bg-transparent"
          >
            ► APPLY
          </button>
        </div>
        <div className="text-green-600 text-xs mt-2">└─[ FILTER CONFIGURED ]</div>
      </div>
      
      {chartData.length > 0 && (
        <div className="border border-green-400 p-6 mb-8 bg-black">
          <h3 className="text-lg font-bold text-green-400 mb-4 terminal-text">
            ┌─[ VISIT FREQUENCY ANALYTICS ]
          </h3>
          <div className="h-64 border border-green-400 bg-black p-4">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis 
                    dataKey="site" 
                    tick={{ fill: '#00ff00', fontSize: 12 }}
                    axisLine={{ stroke: '#00ff00' }}
                  />
                  <YAxis 
                    tick={{ fill: '#00ff00', fontSize: 12 }}
                    axisLine={{ stroke: '#00ff00' }}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    cursor={{ fill: 'rgba(0, 255, 0, 0.1)' }}
                  />
                  <Bar dataKey="visits" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          <div className="text-green-600 text-xs mt-2">└─[ ANALYTICS READY ]</div>
        </div>
      )}
      
      <div className="border border-green-400 bg-black">
        <div className="bg-green-400 text-black px-4 py-2 font-bold">
          ┌─[ HISTORY TABLE ]
        </div>
        <table className="w-full bg-black">
          <thead className="bg-black border-b border-green-400">
            <tr>
              <th className="text-left px-4 py-3 text-green-400 font-bold border-r border-green-400">URL</th>
              <th className="text-left px-4 py-3 text-green-400 font-bold border-r border-green-400">TITLE</th>
              <th className="text-left px-4 py-3 text-green-400 font-bold border-r border-green-400">TIMESTAMP</th>
              <th className="text-left px-4 py-3 text-green-400 font-bold">TYPE</th>
            </tr>
          </thead>
          <tbody>
            {historyData.map((item: HistoryItem, index: number) => (
              <tr key={index} className="border-b border-green-400 hover:bg-green-400/20">
                <td className="px-4 py-3 text-green-400 max-w-md truncate border-r border-green-400">{item.url}</td>
                <td className="px-4 py-3 text-green-400 border-r border-green-400">{item.title}</td>
                <td className="px-4 py-3 text-green-400 border-r border-green-400">{item.timestamp}</td>
                <td className="px-4 py-3 text-green-400">{item.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="bg-green-400 text-black px-4 py-2 text-xs">
          └─[ {historyData.length} RECORDS LOADED ]
        </div>
      </div>
    </div>
  );
};

export default History;
