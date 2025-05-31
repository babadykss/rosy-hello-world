
import React, { useState } from 'react';

interface InfectionProps {
  agentId: string | null;
}

const Infection: React.FC<InfectionProps> = ({ agentId }) => {
  const [infectionType, setInfectionType] = useState<'malware' | 'drainer' | 'both'>('malware');
  const [isInfecting, setIsInfecting] = useState(false);

  const handleInfection = () => {
    setIsInfecting(true);
    
    // Simulate infection process
    setTimeout(() => {
      setIsInfecting(false);
      console.log(`Infection started: ${infectionType} on agent ${agentId}`);
    }, 3000);
  };

  return (
    <div className="p-8 bg-black text-green-400 font-mono">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-green-400 terminal-text mb-2">
          ┌─[ INFECTION CONTROL ]
        </h1>
        <div className="text-cyan-400 text-sm">
          │ Advanced payload deployment<br />
          └─ Target system compromise
        </div>
      </div>

      <div className="border border-red-400 bg-black mb-8 p-6">
        <div className="bg-red-400 text-black px-4 py-2 font-bold mb-4">
          ⚠ [ DANGER ZONE ] ⚠
        </div>
        <div className="text-red-400 mb-4">
          WARNING: This will deploy malicious payloads to the target system.
          Use only on authorized targets for security testing purposes.
        </div>
        <div className="text-green-600 text-xs">
          └─[ AUTHORIZATION REQUIRED ]
        </div>
      </div>

      <div className="border border-green-400 bg-black mb-8">
        <div className="bg-green-400 text-black px-4 py-2 font-bold">
          ┌─[ INFECTION TYPE SELECTION ]
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="infectionType"
                value="malware"
                checked={infectionType === 'malware'}
                onChange={(e) => setInfectionType(e.target.value as 'malware')}
                className="w-4 h-4 text-green-400 border-green-400 focus:ring-green-400 bg-black"
              />
              <div>
                <div className="text-green-400 font-bold">MALWARE</div>
                <div className="text-green-600 text-sm">System infiltration and data extraction</div>
              </div>
            </label>
            
            <label className="flex items-center space-x-3 cursor-pointer opacity-50">
              <input
                type="radio"
                name="infectionType"
                value="drainer"
                checked={infectionType === 'drainer'}
                onChange={(e) => setInfectionType(e.target.value as 'drainer')}
                className="w-4 h-4 text-green-400 border-green-400 focus:ring-green-400 bg-black"
                disabled
              />
              <div>
                <div className="text-green-400 font-bold">DRAINER <span className="text-yellow-400">(SOON)</span></div>
                <div className="text-green-600 text-sm">Crypto wallet drainage and asset extraction</div>
              </div>
            </label>
            
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="infectionType"
                value="both"
                checked={infectionType === 'both'}
                onChange={(e) => setInfectionType(e.target.value as 'both')}
                className="w-4 h-4 text-green-400 border-green-400 focus:ring-green-400 bg-black"
              />
              <div>
                <div className="text-green-400 font-bold">BOTH</div>
                <div className="text-green-600 text-sm">Complete system compromise with asset drainage</div>
              </div>
            </label>
          </div>
        </div>
        <div className="bg-green-400 text-black px-4 py-2 text-xs">
          └─[ TYPE: {infectionType.toUpperCase()} SELECTED ]
        </div>
      </div>

      <div className="border border-green-400 bg-black mb-8">
        <div className="bg-green-400 text-black px-4 py-2 font-bold">
          ┌─[ TARGET INFORMATION ]
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-green-600 text-sm">Target Agent:</div>
              <div className="text-green-400 font-bold">{agentId || 'NO AGENT SELECTED'}</div>
            </div>
            <div>
              <div className="text-green-600 text-sm">Infection Status:</div>
              <div className="text-red-400 font-bold">CLEAN</div>
            </div>
            <div>
              <div className="text-green-600 text-sm">Payload Type:</div>
              <div className="text-cyan-400 font-bold">{infectionType.toUpperCase()}</div>
            </div>
            <div>
              <div className="text-green-600 text-sm">Risk Level:</div>
              <div className="text-red-400 font-bold">CRITICAL</div>
            </div>
          </div>
        </div>
        <div className="bg-green-400 text-black px-4 py-2 text-xs">
          └─[ TARGET ANALYSIS COMPLETE ]
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={handleInfection}
          disabled={!agentId || isInfecting}
          className={`
            px-8 py-4 font-bold text-lg border-2 transition-all
            ${!agentId || isInfecting
              ? 'border-gray-600 text-gray-600 cursor-not-allowed'
              : 'border-red-400 text-red-400 hover:bg-red-400 hover:text-black animate-pulse'
            }
          `}
        >
          {isInfecting ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full"></div>
              <span>INFECTING...</span>
            </div>
          ) : (
            '► START INFECTION'
          )}
        </button>
        
        {!agentId && (
          <div className="text-red-400 text-sm mt-4">
            ⚠ SELECT AN AGENT FIRST
          </div>
        )}
        
        {isInfecting && (
          <div className="text-red-400 text-sm mt-4 animate-pulse">
            ● DEPLOYING PAYLOAD TO TARGET SYSTEM...
          </div>
        )}
      </div>
    </div>
  );
};

export default Infection;
