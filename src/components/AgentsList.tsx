
import React, { useState } from 'react';
import { useAgentData } from '../contexts/AgentDataContext';
import AgentEditDialog from './AgentEditDialog';
import { Flag, Edit, Trash } from 'lucide-react';

interface AgentsListProps {
  onAgentSelect: (agentId: string) => void;
  selectedAgent: string | null;
}

const AgentsList: React.FC<AgentsListProps> = ({ onAgentSelect, selectedAgent }) => {
  const { state, renameAgent, deleteAgent } = useAgentData();
  const [editingAgent, setEditingAgent] = useState<string | null>(null);
  const agents = Object.values(state.agents);

  const handleAgentClick = (agentUID: string) => {
    onAgentSelect(agentUID);
  };

  const handleEditClick = (e: React.MouseEvent, agentUID: string) => {
    e.stopPropagation();
    setEditingAgent(agentUID);
  };

  const handleDeleteClick = (e: React.MouseEvent, agentUID: string) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete agent ${agentUID}?`)) {
      deleteAgent(agentUID);
    }
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
            ├─UID─────────┬─LOCATION─────────────────┬─LAST_SEEN──────┬─STATUS─┬─ACTIONS─┐
          </div>
          
          <div className="space-y-1">
            {agents.map((agent) => (
              <div
                key={agent.uid}
                onClick={() => handleAgentClick(agent.uid)}
                className={`
                  font-mono text-sm cursor-pointer transition-colors p-3 border group
                  ${selectedAgent === agent.uid 
                    ? 'bg-green-400 border-green-400 text-black' 
                    : 'bg-black border-green-400 text-green-400 hover:bg-green-400/20 hover:border-cyan-400'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className={`w-2 h-2 ${agent.status === 'online' ? 'bg-green-400' : 'bg-red-400'} terminal-cursor`}></div>
                    <span className="font-bold min-w-[100px]">{agent.uid}</span>
                    <span className="text-xs opacity-70 flex-1">{agent.host}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs">{agent.lastSeen}</span>
                    <span className={`text-xs ${agent.status === 'online' ? 'text-green-400' : 'text-red-400'}`}>
                      {agent.status.toUpperCase()}
                    </span>
                    
                    {/* Action buttons */}
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleEditClick(e, agent.uid)}
                        className={`p-1 rounded transition-colors ${
                          selectedAgent === agent.uid
                            ? 'hover:bg-black/20 text-black'
                            : 'hover:bg-cyan-400/20 text-cyan-400'
                        }`}
                        title="Edit agent"
                      >
                        <Edit size={12} />
                      </button>
                      <button
                        onClick={(e) => handleDeleteClick(e, agent.uid)}
                        className={`p-1 rounded transition-colors ${
                          selectedAgent === agent.uid
                            ? 'hover:bg-red-400/20 text-red-600'
                            : 'hover:bg-red-400/20 text-red-400'
                        }`}
                        title="Delete agent"
                      >
                        <Trash size={12} />
                      </button>
                    </div>
                    
                    <span className="text-xs">►</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-green-600 text-xs mt-4">
            └─────────────┴─────────────────────────┴────────────────┴────────┴─────────┘
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

      {editingAgent && (
        <AgentEditDialog
          isOpen={true}
          onClose={() => setEditingAgent(null)}
          agentUID={editingAgent}
          onRename={renameAgent}
          onDelete={deleteAgent}
        />
      )}
    </div>
  );
};

export default AgentsList;
