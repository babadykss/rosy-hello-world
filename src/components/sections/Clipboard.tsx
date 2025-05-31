
import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../LoadingSpinner';

interface ClipboardProps {
  agentId: string | null;
}

const Clipboard: React.FC<ClipboardProps> = ({ agentId }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [agentId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const clipboardData = [
    {
      content: 'npm install @layerzero-labs/solidity-examples',
      sourceUrl: 'https://docs.layerzero.network',
      timestamp: '2024-05-31 14:20:15'
    },
    {
      content: 'function _lzSend(uint16 _dstChainId, bytes calldata _payload, address payable _refundAddress, address _zroPaymentAddress, bytes calldata _adapterParams, uint _nativeFee) internal virtual',
      sourceUrl: 'https://github.com/layerzero-labs',
      timestamp: '2024-05-31 14:18:42'
    },
    {
      content: 'const endpoint = "0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"',
      sourceUrl: 'https://layerzero.gitbook.io',
      timestamp: '2024-05-31 14:15:33'
    }
  ];

  return (
    <div className="p-8 bg-black text-green-400 font-mono">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-green-400 terminal-text mb-2">
            ┌─[ CLIPBOARD CAPTURE ]
          </h1>
          <div className="text-cyan-400 text-sm">
            │ Real-time clipboard monitoring<br />
            └─ Content extraction and logging
          </div>
        </div>
        <button className="border border-green-400 text-green-400 px-4 py-2 hover:bg-green-400 hover:text-black transition-colors bg-transparent">
          ► CLEAR
        </button>
      </div>
      
      <div className="border border-green-400 bg-black">
        <div className="bg-green-400 text-black px-4 py-2 font-bold">
          ┌─[ CLIPBOARD DATA TABLE ]
        </div>
        <table className="w-full bg-black">
          <thead className="bg-black border-b border-green-400">
            <tr>
              <th className="text-left px-4 py-3 text-green-400 font-bold border-r border-green-400">CONTENT</th>
              <th className="text-left px-4 py-3 text-green-400 font-bold border-r border-green-400">SOURCE URL</th>
              <th className="text-left px-4 py-3 text-green-400 font-bold">TIMESTAMP</th>
            </tr>
          </thead>
          <tbody>
            {clipboardData.map((item, index) => (
              <tr key={index} className="border-b border-green-400 hover:bg-green-400/20">
                <td className="px-4 py-3 text-green-400 max-w-md border-r border-green-400">
                  <div className="truncate font-mono text-sm">{item.content}</div>
                </td>
                <td className="px-4 py-3 text-green-400 border-r border-green-400">{item.sourceUrl}</td>
                <td className="px-4 py-3 text-green-400">{item.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="bg-green-400 text-black px-4 py-2 text-xs">
          └─[ {clipboardData.length} ENTRIES CAPTURED ]
        </div>
      </div>
    </div>
  );
};

export default Clipboard;
