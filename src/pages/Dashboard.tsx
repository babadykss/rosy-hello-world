
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAgentData } from '../contexts/AgentDataContext';
import Sidebar from '../components/Sidebar';
import AgentsList from '../components/AgentsList';
import AgentDetails from '../components/AgentDetails';
import Overview from '../components/sections/Overview';
import Cookies from '../components/sections/Cookies';
import History from '../components/sections/History';
import Screenshots from '../components/sections/Screenshots';
import Clipboard from '../components/sections/Clipboard';
import SystemRecon from '../components/sections/SystemRecon';
import Bookmarks from '../components/sections/Bookmarks';
import Wallets from '../components/sections/Wallets';
import Infection from '../components/sections/Infection';
import Settings from '../components/sections/Settings';

const Dashboard: React.FC = () => {
  const { logout } = useAuth();
  const { state, selectAgent } = useAgentData();
  const [activeSection, setActiveSection] = useState<string>('Agents');

  const handleAgentSelect = (agentId: string) => {
    selectAgent(agentId);
    setActiveSection('Overview');
  };

  const handleSectionChange = (section: string) => {
    if (section === 'Agents') {
      setActiveSection('Agents');
    } else if (state.selectedAgent) {
      setActiveSection(section);
    }
  };

  const renderContent = () => {
    if (activeSection === 'Agents') {
      return (
        <div className="flex h-full">
          <div className="w-1/2 border-r border-green-400">
            <AgentsList onAgentSelect={handleAgentSelect} selectedAgent={state.selectedAgent} />
          </div>
          <div className="w-1/2">
            <AgentDetails 
              selectedAgent={state.selectedAgent} 
              onSectionSelect={handleSectionChange}
              activeSection={activeSection}
            />
          </div>
        </div>
      );
    }

    // Show error banner if connection is lost
    const connectionError = state.connectionStatus === 'disconnected';

    switch (activeSection) {
      case 'Overview':
        return <Overview agentId={state.selectedAgent} />;
      case 'Cookies':
        return <Cookies agentId={state.selectedAgent} />;
      case 'History':
        return <History agentId={state.selectedAgent} />;
      case 'Screenshots':
        return <Screenshots agentId={state.selectedAgent} />;
      case 'Clipboard':
        return <Clipboard agentId={state.selectedAgent} />;
      case 'Wallets':
        return <Wallets agentId={state.selectedAgent} />;
      case 'System Recon':
        return <SystemRecon agentId={state.selectedAgent} />;
      case 'Bookmarks':
        return <Bookmarks agentId={state.selectedAgent} />;
      case 'Infection':
        return <Infection agentId={state.selectedAgent} />;
      case 'Settings':
        return <Settings agentId={state.selectedAgent} />;
      default:
        return (
          <div className="p-8 text-green-400">
            <div className="border border-red-400 p-4 bg-red-400/10">
              <span className="text-red-400">ERROR:</span> Section not found
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono flex">
      <Sidebar 
        selectedAgent={state.selectedAgent}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />
      
      <div className="flex-1 flex flex-col">
        {state.connectionStatus === 'disconnected' && (
          <div className="bg-red-400/20 border-b border-red-400 px-6 py-2">
            <div className="text-red-400 text-sm">
              ⚠ Connection to Pena backend lost. Attempting to reconnect...
            </div>
          </div>
        )}
        
        <div className="bg-black border-b border-green-400 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-bold text-green-400 terminal-text">
              ┌─[ PENA CONSOLE ]─[ {activeSection.toUpperCase()} ]
            </h2>
            {state.selectedAgent && (
              <div className="text-cyan-400 text-sm">
                └─ AGENT: {state.selectedAgent}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-xs text-green-600">
              <span className={`animate-pulse ${state.connectionStatus === 'connected' ? 'text-green-400' : 'text-red-400'}`}>●</span> 
              {state.connectionStatus.toUpperCase()}
            </div>
            <button
              onClick={logout}
              className="border border-green-400 text-green-400 px-4 py-2 hover:bg-green-400 hover:text-black transition-colors bg-transparent text-sm"
            >
              ► LOGOUT
            </button>
          </div>
        </div>
        
        <div className="flex-1 bg-black">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
