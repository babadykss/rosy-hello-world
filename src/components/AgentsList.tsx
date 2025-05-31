
import React from 'react';
import { useAgentData } from '../contexts/AgentDataContext';

interface AgentsListProps {
  onAgentSelect: (agentId: string) => void;
  selectedAgent: string | null;
}

const AgentsList: React.FC<AgentsListProps> = ({ onAgentSelect, selectedAgent }) => {
  const { state } = useAgentData();
  const agents = Object.values(state.agents);

  const handleAgentClick = (agentUID: string) => {
    onAgentSelect(agentUID);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-black border-b border-green-400 p-6">
        <h3 className="text-lg font-bold text-green-400 mb-2 terminal-text">
          ┌─[ CONNECTED AGENTS ]
        </h3>
        <div className="text-cyan-400 text-sm">
          ├─ Active Sessions: {agents.filter(a => a.status === 'online').length}<br />
          ├─ Total Agents: {agents.length}<br />
          └─ Status: {state.connectionStatus.toUpperCase()}
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <div className="text-green-600 text-xs mb-4">
            ┌─[ AGENT REGISTRY ]─[ REAL-TIME ]<br />
            ├─UID─────────┬─HOST─────────────────┬─LAST_SEEN──────┬─STATUS─┐
          </div>
          
          <div className="space-y-1">
            {agents.map((agent) => (
              <div
                key={agent.uid}
                onClick={() => handleAgentClick(agent.uid)}
                className={`
                  font-mono text-sm cursor-pointer transition-colors p-3 border
                  ${selectedAgent === agent.uid 
                    ? 'bg-green-400 border-green-400 text-black' 
                    : 'bg-black border-green-400 text-green-400 hover:bg-green-400/20 hover:border-cyan-400'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-2 h-2 ${agent.status === 'online' ? 'bg-green-400' : 'bg-red-400'} terminal-cursor`}></div>
                    <span className="font-bold">{agent.uid}</span>
                    <span className="text-xs opacity-70">{agent.host}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs">{agent.lastSeen}</span>
                    <span className={`text-xs ${agent.status === 'online' ? 'text-green-400' : 'text-red-400'}`}>
                      {agent.status.toUpperCase()}
                    </span>
                    <span className="text-xs">►</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-green-600 text-xs mt-4">
            └─────────────┴─────────────────────┴────────────────┴────────┘
          </div>
        </div>
      </div>
      
      {state.connectionStatus !== 'connected' && (
        <div className="border-t border-green-400 p-4">
          <div className="text-xs text-yellow-400">
            ⚠ CONNECTION: {state.connectionStatus.toUpperCase()}<br />
            └─ Attempting to reconnect to ws://localhost:5000/pena...
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentsList;
