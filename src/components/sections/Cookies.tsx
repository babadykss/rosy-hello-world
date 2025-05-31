
import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../LoadingSpinner';

interface CookiesProps {
  agentId: string | null;
}

interface Cookie {
  domain: string;
  name: string;
  value: string;
  path: string;
  secure: boolean;
  httpOnly: boolean;
  expires: string;
}

const mockCookies: Cookie[] = [
  {
    domain: 'google.com',
    name: '_ga',
    value: 'GA1.2.123456789.1234567890',
    path: '/',
    secure: true,
    httpOnly: false,
    expires: '2025-05-31'
  },
  {
    domain: 'github.com',
    name: 'session_id',
    value: 'abc123def456',
    path: '/',
    secure: true,
    httpOnly: true,
    expires: '2024-06-01'
  },
  {
    domain: 'stackoverflow.com',
    name: 'preferences',
    value: 'theme=dark',
    path: '/',
    secure: false,
    httpOnly: false,
    expires: 'Session'
  },
  {
    domain: 'facebook.com',
    name: 'datr',
    value: 'xyz789abc123',
    path: '/',
    secure: true,
    httpOnly: true,
    expires: '2025-12-31'
  },
  {
    domain: 'twitter.com',
    name: 'auth_token',
    value: 'token_xyz123',
    path: '/',
    secure: true,
    httpOnly: false,
    expires: '2024-08-15'
  }
];

const Cookies: React.FC<CookiesProps> = ({ agentId }) => {
  const [loading, setLoading] = useState(true);
  const [domainFilter, setDomainFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [agentId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const filteredCookies = mockCookies.filter(cookie => 
    cookie.domain.toLowerCase().includes(domainFilter.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCookies.length / itemsPerPage);
  const paginatedCookies = filteredCookies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-8 bg-black text-green-400 font-mono">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-green-400 terminal-text mb-2">
            ┌─[ BROWSER COOKIES ]
          </h1>
          <div className="text-cyan-400 text-sm">
            │ Domain filtering • Session tracking<br />
            └─ Real-time cookie extraction
          </div>
        </div>
        <button className="border border-green-400 text-green-400 px-4 py-2 hover:bg-green-400 hover:text-black transition-colors bg-transparent">
          ► REFRESH
        </button>
      </div>
      
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Filter by domain..."
          value={domainFilter}
          onChange={(e) => setDomainFilter(e.target.value)}
          className="bg-black border border-green-400 text-green-400 px-4 py-2 focus:outline-none focus:border-cyan-400 transition-colors font-mono placeholder-green-600"
        />
        <button 
          onClick={() => setDomainFilter('')}
          className="border border-green-400 text-green-400 px-6 py-2 hover:bg-green-400 hover:text-black transition-colors bg-transparent"
        >
          ► CLEAR
        </button>
      </div>
      
      <div className="border border-green-400 bg-black">
        <div className="bg-green-400 text-black px-4 py-2 font-bold">
          ┌─[ COOKIE DATA TABLE ]
        </div>
        <table className="w-full bg-black">
          <thead className="bg-black border-b border-green-400">
            <tr>
              <th className="text-left px-4 py-3 text-green-400 font-bold border-r border-green-400">DOMAIN</th>
              <th className="text-left px-4 py-3 text-green-400 font-bold border-r border-green-400">NAME</th>
              <th className="text-left px-4 py-3 text-green-400 font-bold border-r border-green-400">VALUE</th>
              <th className="text-left px-4 py-3 text-green-400 font-bold border-r border-green-400">PATH</th>
              <th className="text-left px-4 py-3 text-green-400 font-bold border-r border-green-400">SECURE</th>
              <th className="text-left px-4 py-3 text-green-400 font-bold border-r border-green-400">HTTP_ONLY</th>
              <th className="text-left px-4 py-3 text-green-400 font-bold">EXPIRES</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCookies.map((cookie, index) => (
              <tr key={index} className="border-b border-green-400 hover:bg-green-400/20">
                <td className="px-4 py-3 text-green-400 border-r border-green-400">{cookie.domain}</td>
                <td className="px-4 py-3 text-green-400 border-r border-green-400">{cookie.name}</td>
                <td className="px-4 py-3 text-green-400 max-w-xs truncate border-r border-green-400">{cookie.value}</td>
                <td className="px-4 py-3 text-green-400 border-r border-green-400">{cookie.path}</td>
                <td className="px-4 py-3 text-green-400 border-r border-green-400">
                  <span className={cookie.secure ? 'text-green-400' : 'text-red-400'}>
                    {cookie.secure ? 'YES' : 'NO'}
                  </span>
                </td>
                <td className="px-4 py-3 text-green-400 border-r border-green-400">
                  <span className={cookie.httpOnly ? 'text-green-400' : 'text-red-400'}>
                    {cookie.httpOnly ? 'YES' : 'NO'}
                  </span>
                </td>
                <td className="px-4 py-3 text-green-400">{cookie.expires}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="bg-green-400 text-black px-4 py-2 text-xs">
          └─[ {filteredCookies.length} COOKIES FOUND • PAGE {currentPage} OF {totalPages} ]
        </div>
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 border transition-colors ${
                currentPage === page 
                  ? 'text-black bg-green-400 border-green-400' 
                  : 'text-green-400 border-green-400 hover:bg-green-400/20'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cookies;
