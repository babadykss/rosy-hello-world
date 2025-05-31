
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [showInputs, setShowInputs] = useState(false);
  const { login, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const terminalText = `
██████╗ ███████╗███╗   ██╗ █████╗ 
██╔══██╗██╔════╝████╗  ██║██╔══██╗
██████╔╝█████╗  ██╔██╗ ██║███████║
██╔═══╝ ██╔══╝  ██║╚██╗██║██╔══██║
██║     ███████╗██║ ╚████║██║  ██║
╚═╝     ╚══════╝╚═╝  ╚═══╝╚═╝  ╚═╝

PENA TERMINAL v1.0.0
Secure Administration Console
Copyright (c) 2024 Pena Systems

Initializing secure connection...
Authentication required to proceed.
`;

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < terminalText.length) {
        setDisplayText(terminalText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowInputs(true), 500);
      }
    }, 20);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      return;
    }
    const success = login(username, password);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center font-mono text-green-400">
      <div className="w-full max-w-2xl p-8">
        <div className="bg-black border border-green-400 p-8 terminal-glow">
          <pre className="text-green-400 text-sm mb-8 whitespace-pre-wrap terminal-text">
            {displayText}
            <span className="terminal-cursor">█</span>
          </pre>
          
          {showInputs && (
            <>
              <div className="mb-6">
                <div className="text-cyan-400 mb-4">
                  ┌─[ AUTHENTICATION REQUIRED ]
                  │
                  ├─ Enter credentials to access admin console
                  └─ Unauthorized access will be logged and reported
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">root@pena:~$</span>
                  <span className="text-white mr-2">login</span>
                  <input
                    type="text"
                    placeholder="admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-black border border-green-400 text-green-400 px-3 py-2 focus:outline-none focus:border-cyan-400 transition-colors flex-1 font-mono"
                  />
                </div>
                
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">root@pena:~$</span>
                  <span className="text-white mr-2">passwd</span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-black border border-green-400 text-green-400 px-3 py-2 focus:outline-none focus:border-cyan-400 transition-colors flex-1 font-mono"
                  />
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    className="border border-green-400 text-green-400 px-6 py-2 hover:bg-green-400 hover:text-black transition-colors bg-transparent"
                  >
                    ► AUTHENTICATE
                  </button>
                </div>
                
                {error && (
                  <div className="pt-4">
                    <div className="text-red-400 border border-red-400 p-3 bg-red-400/10">
                      <span className="font-bold">ERROR:</span> {error}
                      <br />
                      <span className="text-sm">Access denied. Check credentials.</span>
                    </div>
                  </div>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
