
import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../LoadingSpinner';

interface BookmarksProps {
  agentId: string | null;
}

interface Bookmark {
  title: string;
  url: string;
  createdAt: string;
}

interface BookmarkFolder {
  name: string;
  count: number;
  bookmarks: Bookmark[];
}

const Bookmarks: React.FC<BookmarksProps> = ({ agentId }) => {
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState<string>('Development');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['Development', 'Research']));

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [agentId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const bookmarkFolders: Record<string, BookmarkFolder> = {
    'Development': {
      name: 'Development',
      count: 8,
      bookmarks: [
        {
          title: 'LayerZero Documentation',
          url: 'https://docs.layerzero.network',
          createdAt: '2024-05-31 10:15:00'
        },
        {
          title: 'GitHub - LayerZero Labs',
          url: 'https://github.com/layerzero-labs',
          createdAt: '2024-05-31 10:12:00'
        },
        {
          title: 'Solidity by Example',
          url: 'https://solidity-by-example.org',
          createdAt: '2024-05-30 16:30:00'
        }
      ]
    },
    'Research': {
      name: 'Research',
      count: 5,
      bookmarks: [
        {
          title: 'Cross-chain Protocols Analysis',
          url: 'https://research.paradigm.xyz/cross-chain',
          createdAt: '2024-05-29 14:20:00'
        },
        {
          title: 'Blockchain Interoperability Papers',
          url: 'https://arxiv.org/list/cs.CR/recent',
          createdAt: '2024-05-28 11:45:00'
        }
      ]
    },
    'Tools': {
      name: 'Tools',
      count: 3,
      bookmarks: [
        {
          title: 'Hardhat Documentation',
          url: 'https://hardhat.org/docs',
          createdAt: '2024-05-27 09:30:00'
        }
      ]
    }
  };

  const toggleFolder = (folderName: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderName)) {
      newExpanded.delete(folderName);
    } else {
      newExpanded.add(folderName);
    }
    setExpandedFolders(newExpanded);
  };

  const handleExportCSV = () => {
    const selectedBookmarks = bookmarkFolders[selectedFolder]?.bookmarks || [];
    const csvContent = [
      'Title,URL,Created At',
      ...selectedBookmarks.map(bookmark => 
        `"${bookmark.title}","${bookmark.url}","${bookmark.createdAt}"`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookmarks_${selectedFolder}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 bg-black text-green-400 font-mono">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-green-400 terminal-text mb-2">
          ┌─[ BOOKMARKS COLLECTION ]
        </h1>
        <div className="text-cyan-400 text-sm">
          │ Bookmark folder structure<br />
          │ Complete hierarchy extraction<br />
          └─ Preserves metadata
        </div>
      </div>
      
      <div className="flex gap-8">
        <div className="w-1/3">
          <div className="border border-green-400 bg-black">
            <div className="bg-green-400 text-black px-4 py-2 font-bold">
              ┌─[ FOLDERS ]
            </div>
            <div className="p-4 space-y-2">
              {Object.values(bookmarkFolders).map((folder) => (
                <div key={folder.name}>
                  <div
                    onClick={() => {
                      toggleFolder(folder.name);
                      setSelectedFolder(folder.name);
                    }}
                    className={`
                      flex items-center justify-between p-3 cursor-pointer transition-colors border border-green-400
                      ${selectedFolder === folder.name 
                        ? 'bg-green-400 text-black' 
                        : 'text-green-400 hover:bg-green-400/20'
                      }
                    `}
                  >
                    <div className="flex items-center">
                      <span className="mr-2">
                        {expandedFolders.has(folder.name) ? '📂' : '📁'}
                      </span>
                      <span className="font-mono">{folder.name}</span>
                    </div>
                    <span className="text-sm">({folder.count})</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-green-400 text-black px-4 py-2 text-xs">
              └─[ {Object.keys(bookmarkFolders).length} FOLDERS ]
            </div>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="border border-green-400 bg-black">
            <div className="bg-green-400 text-black px-4 py-2 font-bold flex justify-between items-center">
              <span>┌─[ {selectedFolder.toUpperCase()} BOOKMARKS ]</span>
              <button
                onClick={handleExportCSV}
                className="bg-black border border-black text-green-400 px-3 py-1 hover:bg-green-600 hover:text-black transition-colors text-xs"
              >
                ► EXPORT CSV
              </button>
            </div>
            
            <table className="w-full bg-black">
              <thead className="bg-black border-b border-green-400">
                <tr>
                  <th className="text-left px-4 py-3 text-green-400 font-bold border-r border-green-400">TITLE</th>
                  <th className="text-left px-4 py-3 text-green-400 font-bold border-r border-green-400">URL</th>
                  <th className="text-left px-4 py-3 text-green-400 font-bold">CREATION TIMESTAMP</th>
                </tr>
              </thead>
              <tbody>
                {(bookmarkFolders[selectedFolder]?.bookmarks || []).map((bookmark, index) => (
                  <tr key={index} className="border-b border-green-400 hover:bg-green-400/20">
                    <td className="px-4 py-3 text-green-400 border-r border-green-400">{bookmark.title}</td>
                    <td className="px-4 py-3 text-green-400 max-w-md truncate border-r border-green-400 font-mono text-sm">{bookmark.url}</td>
                    <td className="px-4 py-3 text-green-400">{bookmark.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="bg-green-400 text-black px-4 py-2 text-xs">
              └─[ {bookmarkFolders[selectedFolder]?.bookmarks.length || 0} BOOKMARKS LOADED ]
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookmarks;
