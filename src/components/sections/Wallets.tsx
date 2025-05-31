
import React, { useState, useEffect } from 'react';
import { useAgentData } from '../../contexts/AgentDataContext';
import LoadingSpinner from '../LoadingSpinner';

interface WalletsProps {
  agentId: string | null;
}

interface Wallet {
  address: string;
  balance: string;
  network: string;
  status: string;
}

const Wallets: React.FC<WalletsProps> = ({ agentId }) => {
  const { getAgentData, hasError } = useAgentData();
  const [loading, setLoading] = useState(true);

  const walletsData = agentId ? getAgentData(agentId, 'wallets') : null;
  const error = agentId ? hasError(agentId, 'wallets') : null;

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
          <span className="text-red-400">ERROR:</span> Error loading Wallets: {error}
        </div>
      </div>
    );
  }

  if (!walletsData || !Array.isArray(walletsData) || walletsData.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-green-600 mb-4">
            ╔═══════════════════════════════╗<br />
            ║                               ║<br />
            ║        NO WALLETS DATA        ║<br />
            ║                               ║<br />
            ║   No crypto wallets detected  ║<br />
            ║   or extension access denied  ║<br />
            ║                               ║<br />
            ╚═══════════════════════════════╝
          </div>
          <p className="text-green-400 text-sm">← Wallets data pending</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-black text-green-400 font-mono">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-green-400 terminal-text mb-2">
          ┌─[ CRYPTO WALLETS ]
        </h1>
        <div className="text-cyan-400 text-sm">
          │ Real-time wallet detection<br />
          └─ Balance and network monitoring
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {walletsData.map((wallet: Wallet, index: number) => (
          <div key={index} className="border border-green-400 p-6 bg-black terminal-glow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-green-400 flex items-center">
                <span className="mr-2">◭</span> WALLET #{index + 1}
              </h3>
              <span className={`px-2 py-1 text-xs border ${
                wallet.status === 'connected' 
                  ? 'border-green-400 text-green-400' 
                  : 'border-red-400 text-red-400'
              }`}>
                {wallet.status.toUpperCase()}
              </span>
            </div>
            
            <div className="space-y-2 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-green-600">Address:</span>
                <span className="text-green-400 font-mono text-xs">{wallet.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-600">Balance:</span>
                <span className="text-cyan-400">{wallet.balance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-600">Network:</span>
                <span className="text-green-400">{wallet.network}</span>
              </div>
            </div>
            
            <div className="mt-4 text-xs text-green-600 border-t border-green-400 pt-2">
              ═══════════════════════════<br />
              Status: {wallet.status} • Network: {wallet.network}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 border border-green-400 p-4 bg-black">
        <div className="text-green-400 mb-2">┌─[ WALLET SUMMARY ]</div>
        <div className="text-sm">
          │ Total Wallets: {walletsData.length}<br />
          │ Connected: {walletsData.filter((w: Wallet) => w.status === 'connected').length}<br />
          └─ Networks: {[...new Set(walletsData.map((w: Wallet) => w.network))].join(', ')}
        </div>
      </div>
    </div>
  );
};

export default Wallets;
