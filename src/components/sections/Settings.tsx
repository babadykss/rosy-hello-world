
import React, { useState } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

interface SettingsProps {
  agentId: string | null;
}

const Settings: React.FC<SettingsProps> = ({ agentId }) => {
  const [settings, setSettings] = useState({
    autoRefresh: true,
    refreshInterval: 5000,
    enableNotifications: true,
    maxLogEntries: 1000,
    secureConnection: true,
    debugMode: false,
    dataRetention: 30,
    compressionEnabled: true,
    encryptionLevel: 'AES-256'
  });

  const handleToggle = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleNumberChange = (key: string, value: number) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (!agentId) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-green-600 mb-4">
            ╔═══════════════════════════════╗<br />
            ║                               ║<br />
            ║     NO AGENT SELECTED         ║<br />
            ║                               ║<br />
            ║  Select an agent to access    ║<br />
            ║  configuration settings       ║<br />
            ║                               ║<br />
            ╚═══════════════════════════════╝
          </div>
          <p className="text-green-400 text-sm">← Select agent to configure</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-green-400 mb-2 terminal-text">
          ┌─[ SETTINGS ]─[ AGENT: {agentId} ]
        </h1>
        <div className="text-cyan-400 text-sm">
          ├─ Agent configuration parameters<br />
          └─ Runtime behavior settings
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Collection Settings */}
        <div className="bg-black border border-green-400 p-6 terminal-glow">
          <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center">
            <span className="mr-2">◉</span> DATA COLLECTION
          </h3>
          <div className="space-y-4 font-mono text-sm">
            <div className="flex justify-between items-center">
              <span className="text-green-600">Auto Refresh:</span>
              <button
                onClick={() => handleToggle('autoRefresh')}
                className={`px-3 py-1 border text-xs ${
                  settings.autoRefresh 
                    ? 'bg-green-400 text-black border-green-400' 
                    : 'bg-black text-green-400 border-green-400'
                }`}
              >
                {settings.autoRefresh ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-green-600">Refresh Interval:</span>
              <select
                value={settings.refreshInterval}
                onChange={(e) => handleNumberChange('refreshInterval', Number(e.target.value))}
                className="bg-black border border-green-400 text-green-400 px-2 py-1 text-xs"
              >
                <option value={1000}>1s</option>
                <option value={5000}>5s</option>
                <option value={10000}>10s</option>
                <option value={30000}>30s</option>
                <option value={60000}>1m</option>
              </select>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-green-600">Max Log Entries:</span>
              <input
                type="number"
                value={settings.maxLogEntries}
                onChange={(e) => handleNumberChange('maxLogEntries', Number(e.target.value))}
                className="bg-black border border-green-400 text-green-400 px-2 py-1 text-xs w-20"
                min="100"
                max="10000"
                step="100"
              />
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-green-600">Data Retention:</span>
              <select
                value={settings.dataRetention}
                onChange={(e) => handleNumberChange('dataRetention', Number(e.target.value))}
                className="bg-black border border-green-400 text-green-400 px-2 py-1 text-xs"
              >
                <option value={7}>7 days</option>
                <option value={30}>30 days</option>
                <option value={90}>90 days</option>
                <option value={365}>1 year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-black border border-green-400 p-6 terminal-glow">
          <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center">
            <span className="mr-2">🔒</span> SECURITY
          </h3>
          <div className="space-y-4 font-mono text-sm">
            <div className="flex justify-between items-center">
              <span className="text-green-600">Secure Connection:</span>
              <button
                onClick={() => handleToggle('secureConnection')}
                className={`px-3 py-1 border text-xs ${
                  settings.secureConnection 
                    ? 'bg-green-400 text-black border-green-400' 
                    : 'bg-red-400 text-black border-red-400'
                }`}
              >
                {settings.secureConnection ? 'TLS' : 'PLAIN'}
              </button>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-green-600">Encryption Level:</span>
              <select
                value={settings.encryptionLevel}
                onChange={(e) => setSettings(prev => ({ ...prev, encryptionLevel: e.target.value }))}
                className="bg-black border border-green-400 text-green-400 px-2 py-1 text-xs"
              >
                <option value="AES-128">AES-128</option>
                <option value="AES-256">AES-256</option>
                <option value="ChaCha20">ChaCha20</option>
              </select>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-green-600">Compression:</span>
              <button
                onClick={() => handleToggle('compressionEnabled')}
                className={`px-3 py-1 border text-xs ${
                  settings.compressionEnabled 
                    ? 'bg-green-400 text-black border-green-400' 
                    : 'bg-black text-green-400 border-green-400'
                }`}
              >
                {settings.compressionEnabled ? 'GZIP' : 'NONE'}
              </button>
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-black border border-green-400 p-6 terminal-glow">
          <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center">
            <span className="mr-2">⚙</span> SYSTEM
          </h3>
          <div className="space-y-4 font-mono text-sm">
            <div className="flex justify-between items-center">
              <span className="text-green-600">Notifications:</span>
              <button
                onClick={() => handleToggle('enableNotifications')}
                className={`px-3 py-1 border text-xs ${
                  settings.enableNotifications 
                    ? 'bg-green-400 text-black border-green-400' 
                    : 'bg-black text-green-400 border-green-400'
                }`}
              >
                {settings.enableNotifications ? 'ON' : 'OFF'}
              </button>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-green-600">Debug Mode:</span>
              <button
                onClick={() => handleToggle('debugMode')}
                className={`px-3 py-1 border text-xs ${
                  settings.debugMode 
                    ? 'bg-yellow-400 text-black border-yellow-400' 
                    : 'bg-black text-green-400 border-green-400'
                }`}
              >
                {settings.debugMode ? 'VERBOSE' : 'NORMAL'}
              </button>
            </div>
          </div>
        </div>

        {/* Connection Info */}
        <div className="bg-black border border-green-400 p-6 terminal-glow">
          <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center">
            <span className="mr-2">📡</span> CONNECTION
          </h3>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex justify-between">
              <span className="text-green-600">WebSocket:</span>
              <span className="text-cyan-400">ws://localhost:5000/pena</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-600">Protocol:</span>
              <span className="text-green-400">PENA v1.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-600">Ping Interval:</span>
              <span className="text-green-400">30s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-600">Timeout:</span>
              <span className="text-green-400">60s</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <div className="text-xs text-green-600">
          ┌─[ CONFIG STATUS ]<br />
          ├─ Last Modified: 2024-05-31 18:21:00<br />
          ├─ Profile: Production<br />
          └─ Auto-Save: Enabled
        </div>
        
        <div className="space-x-4">
          <button className="border border-green-400 text-green-400 px-4 py-2 hover:bg-green-400 hover:text-black transition-colors bg-transparent text-sm">
            ► SAVE CONFIG
          </button>
          <button className="border border-yellow-400 text-yellow-400 px-4 py-2 hover:bg-yellow-400 hover:text-black transition-colors bg-transparent text-sm">
            ◉ RESET
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
