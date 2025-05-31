
import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../LoadingSpinner';

interface WalletsProps {
  agentId: string | null;
}

interface Wallet {
  type: 'MetaMask' | 'Phantom' | 'Trust Wallet' | 'Coinbase' | 'WalletConnect';
  address: string;
  balance: string;
  network: string;
  status: 'connected' | 'disconnected';
}

const mockWallets: Wallet[] = [
  {
    type: 'MetaMask',
    address: '0x742d35Cc6511C864C3C06B8ddAf2f0E8fd7FbE75',
    balance: '2.45 ETH',
    network: 'Ethereum',
    status: 'connected'
  },
  {
    type: 'Phantom',
    address: 'DjVE6JNiYqPL2QXyCUUh8rNjHRgH1yqvhQJvEwrMhL5Z',
    balance: '15.32 SOL',
    network: 'Solana',
    status: 'connected'
  },
  {
    type: 'Trust Wallet',
    address: '0x8ba1f109551bD432803012645Hac136c22C501e5',
    balance: '1,250.45 USDT',
    network: 'BSC',
    status: 'disconnected'
  },
  {
    type: 'Coinbase',
    address: '0x123abc789def456ghi789jkl012mno345pqr678st',
    balance: '0.00854 BTC',
    network: 'Bitcoin',
    status: 'connected'
  }
];

const Wallets: React.FC<WalletsProps> = ({ agentId }) => {
  const [loading, setLoading] = useState(true);
  const [walletFilter, setWalletFilter] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [agentId]);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const handleClear = () => {
    setWalletFilter('');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const filteredWallets = mockWallets.filter(wallet => 
    wallet.type.toLowerCase().includes(walletFilter.toLowerCase()) ||
    wallet.address.toLowerCase().includes(walletFilter.toLowerCase())
  );

  return (
    <div className="p-8 bg-black text-green-400 font-mono">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-green-400 terminal-text mb-2">
            ┌─[ CRYPTO WALLETS ]
          </h1>
          <div className="text-cyan-400 text-sm">
            │ Multi-chain wallet detection<br />
            └─ Real-time balance tracking
          </div>
        </div>
        <button 
          onClick={handleRefresh}
          className="border border-green-400 text-green-400 px-4 py-2 hover:bg-green-400 hover:text-black transition-colors bg-transparent"
        >
          ► REFRESH
        </button>
      </div>
      
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Filter by wallet type or address..."
          value={walletFilter}
          onChange={(e) => setWalletFilter(e.target.value)}
          className="bg-black border border-green-400 text-green-400 px-4 py-2 focus:outline-none focus:border-cyan-400 transition-colors font-mono placeholder-green-600"
        />
        <button 
          onClick={handleClear}
          className="border border-green-400 text-green-400 px-6 py-2 hover:bg-green-400 hover:text-black transition-colors bg-transparent"
        >
          ► CLEAR
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {filteredWallets.map((wallet, index) => (
          <div key={index} className="border border-green-400 bg-black p-4">
            <div className="bg-green-400 text-black px-4 py-2 font-bold mb-4">
              ┌─[ {wallet.type.toUpperCase()} ]
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-green-600">Address:</span>
                <span className="text-green-400 font-mono text-xs">{wallet.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-600">Balance:</span>
                <span className="text-cyan-400 font-bold">{wallet.balance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-600">Network:</span>
                <span className="text-green-400">{wallet.network}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-600">Status:</span>
                <span className={wallet.status === 'connected' ? 'text-green-400' : 'text-red-400'}>
                  {wallet.status.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="text-green-600 text-xs mt-2">└─[ WALLET DETECTED ]</div>
          </div>
        ))}
      </div>

      <div className="border border-green-400 bg-black">
        <div className="bg-green-400 text-black px-4 py-2 font-bold">
          ┌─[ WALLET SUMMARY ]
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-cyan-400">{filteredWallets.length}</div>
              <div className="text-green-600 text-xs">TOTAL WALLETS</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{filteredWallets.filter(w => w.status === 'connected').length}</div>
              <div className="text-green-600 text-xs">CONNECTED</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">{filteredWallets.filter(w => w.status === 'disconnected').length}</div>
              <div className="text-green-600 text-xs">DISCONNECTED</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">{new Set(filteredWallets.map(w => w.network)).size}</div>
              <div className="text-green-600 text-xs">NETWORKS</div>
            </div>
          </div>
        </div>
        <div className="bg-green-400 text-black px-4 py-2 text-xs">
          └─[ ANALYSIS COMPLETE ]
        </div>
      </div>
    </div>
  );
};

export default Wallets;
