
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

interface AgentOverview {
  status: string;
  lastPing: string;
  cpuLoad: string;
  ramUsage: string;
  hostname: string;
  os: string;
  browser: string;
  ipAddress: string;
  commands: Array<{
    time: string;
    command: string;
  }>;
}

interface AgentData {
  overview: AgentOverview | null;
  cookies: any[] | null;
  history: any[] | null;
  screenshots: any[] | null;
  clipboard: any[] | null;
  dom: any | null;
  localStorage: any | null;
  systemRecon: any | null;
  bookmarks: any | null;
}

interface AgentInfo {
  uid: string;
  host: string;
  lastSeen: string;
  status: 'online' | 'offline';
}

interface AgentDataState {
  agents: Record<string, AgentInfo>;
  agentData: Record<string, AgentData>;
  selectedAgent: string | null;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
  errors: Record<string, string>;
}

type AgentDataAction = 
  | { type: 'SET_AGENTS'; payload: Record<string, AgentInfo> }
  | { type: 'ADD_AGENT'; payload: AgentInfo }
  | { type: 'SELECT_AGENT'; payload: string }
  | { type: 'UPDATE_AGENT_DATA'; payload: { agentUID: string; section: string; data: any } }
  | { type: 'SET_ERROR'; payload: { agentUID: string; section: string; error: string } }
  | { type: 'SET_CONNECTION_STATUS'; payload: 'connected' | 'connecting' | 'disconnected' }
  | { type: 'CLEAR_ERROR'; payload: { agentUID: string; section: string } };

const initialState: AgentDataState = {
  agents: {},
  agentData: {},
  selectedAgent: null,
  connectionStatus: 'disconnected',
  errors: {}
};

function agentDataReducer(state: AgentDataState, action: AgentDataAction): AgentDataState {
  switch (action.type) {
    case 'SET_AGENTS':
      return { ...state, agents: action.payload };
    
    case 'ADD_AGENT':
      return {
        ...state,
        agents: { ...state.agents, [action.payload.uid]: action.payload },
        agentData: {
          ...state.agentData,
          [action.payload.uid]: {
            overview: null,
            cookies: null,
            history: null,
            screenshots: null,
            clipboard: null,
            dom: null,
            localStorage: null,
            systemRecon: null,
            bookmarks: null
          }
        }
      };
    
    case 'SELECT_AGENT':
      return { ...state, selectedAgent: action.payload };
    
    case 'UPDATE_AGENT_DATA':
      const { agentUID, section, data } = action.payload;
      return {
        ...state,
        agentData: {
          ...state.agentData,
          [agentUID]: {
            ...state.agentData[agentUID],
            [section.toLowerCase()]: data
          }
        }
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [`${action.payload.agentUID}_${action.payload.section}`]: action.payload.error
        }
      };
    
    case 'CLEAR_ERROR':
      const errorKey = `${action.payload.agentUID}_${action.payload.section}`;
      const { [errorKey]: removed, ...remainingErrors } = state.errors;
      return { ...state, errors: remainingErrors };
    
    case 'SET_CONNECTION_STATUS':
      return { ...state, connectionStatus: action.payload };
    
    default:
      return state;
  }
}

interface AgentDataContextType {
  state: AgentDataState;
  selectAgent: (agentUID: string) => void;
  getAgentData: (agentUID: string, section: string) => any;
  hasError: (agentUID: string, section: string) => string | null;
}

const AgentDataContext = createContext<AgentDataContextType | undefined>(undefined);

export const useAgentData = () => {
  const context = useContext(AgentDataContext);
  if (!context) {
    throw new Error('useAgentData must be used within AgentDataProvider');
  }
  return context;
};

interface AgentDataProviderProps {
  children: ReactNode;
}

export const AgentDataProvider: React.FC<AgentDataProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(agentDataReducer, initialState);

  useEffect(() => {
    // Initialize with mock data
    const mockAgents = {
      'AGT-001': {
        uid: 'AGT-001',
        host: 'desktop-pc-01.local',
        lastSeen: '2024-05-31 14:23:15',
        status: 'online' as const
      },
      'AGT-002': {
        uid: 'AGT-002',
        host: 'laptop-dev-02.local',
        lastSeen: '2024-05-31 14:20:42',
        status: 'online' as const
      },
      'AGT-003': {
        uid: 'AGT-003',
        host: 'server-main-03.local',
        lastSeen: '2024-05-31 14:18:33',
        status: 'offline' as const
      }
    };

    dispatch({ type: 'SET_AGENTS', payload: mockAgents });
    Object.values(mockAgents).forEach(agent => {
      dispatch({ type: 'ADD_AGENT', payload: agent });
    });

    // Simulate WebSocket connection
    dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'connecting' });
    
    const connectTimeout = setTimeout(() => {
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'connected' });
      console.log('Connected to PENA backend on ws://localhost:5000/pena');
    }, 1000);

    // Simulate incoming data
    const dataTimeout = setTimeout(() => {
      // Mock overview data for AGT-001
      dispatch({
        type: 'UPDATE_AGENT_DATA',
        payload: {
          agentUID: 'AGT-001',
          section: 'overview',
          data: {
            status: 'ONLINE',
            lastPing: '2024-01-15 14:32:18',
            cpuLoad: '23.4%',
            ramUsage: '1.2GB / 8.0GB',
            hostname: 'WORKSTATION-01',
            os: 'Windows 11 Pro',
            browser: 'Chrome 120.0.6099.109',
            ipAddress: '192.168.1.42',
            commands: [
              { time: '15:42:33', command: 'screenshot_capture(full_page=true)' },
              { time: '15:41:12', command: 'extract_cookies(domain="example.com")' },
              { time: '15:39:45', command: 'get_browser_history(days=7)' }
            ]
          }
        }
      });
    }, 2000);

    return () => {
      clearTimeout(connectTimeout);
      clearTimeout(dataTimeout);
    };
  }, []);

  const selectAgent = (agentUID: string) => {
    dispatch({ type: 'SELECT_AGENT', payload: agentUID });
  };

  const getAgentData = (agentUID: string, section: string) => {
    return state.agentData[agentUID]?.[section.toLowerCase()] || null;
  };

  const hasError = (agentUID: string, section: string) => {
    return state.errors[`${agentUID}_${section}`] || null;
  };

  return (
    <AgentDataContext.Provider value={{ state, selectAgent, getAgentData, hasError }}>
      {children}
    </AgentDataContext.Provider>
  );
};
