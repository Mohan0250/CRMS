import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { DEAL_STAGES, Deal } from '../types';
import { apiService } from '../services/apiService';

interface AppContextType {
  groupedDeals: Record<string, Deal[]>;
  setGroupedDeals: React.Dispatch<React.SetStateAction<Record<string, Deal[]>>>;
  totalRevenue: number;
  monthlyRevenue: { name: string; value: number }[];
  isLoading: boolean;
  connectionStatus: 'checking' | 'connected' | 'error';
  diagnosticInfo: {
    isUrlReachable: boolean | null;
    isApiKeyValid: boolean | null;
    areTablesReady: boolean | null;
    errorMessage: string | null;
  };
  refreshDeals: () => Promise<void>;
  runDiagnostic: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [groupedDeals, setGroupedDeals] = useState<Record<string, Deal[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [diagnosticInfo, setDiagnosticInfo] = useState<{
    isUrlReachable: boolean | null;
    isApiKeyValid: boolean | null;
    areTablesReady: boolean | null;
    errorMessage: string | null;
  }>({
    isUrlReachable: null,
    isApiKeyValid: null,
    areTablesReady: null,
    errorMessage: null
  });

  const runDiagnostic = async () => {
    setConnectionStatus('checking');
    const info = {
      isUrlReachable: false,
      isApiKeyValid: false,
      areTablesReady: false,
      errorMessage: null as string | null
    };

    try {
      // 1. Test URL Reachability (Simple fetch)
      const url = (import.meta as any).env.VITE_SUPABASE_URL || 'https://ulicipmpbikproqjqjz.supabase.co';
      try {
        const res = await fetch(`${url}/rest/v1/`, { method: 'GET' });
        info.isUrlReachable = res.status === 200 || res.status === 401; // 401 is fine, means we reached it but no key
      } catch (e) {
        info.isUrlReachable = false;
        info.errorMessage = "Network Error: Browser blocked the request. Check Ad-blockers or Firewall.";
        setDiagnosticInfo(info);
        setConnectionStatus('error');
        return;
      }

      // 2. Test API Key & Connection
      try {
        const { error } = await apiService.deals.getAll().then(() => ({ error: null })).catch(e => ({ error: e }));
        if (error) {
          if (error.message?.includes('Invalid API key')) {
            info.isApiKeyValid = false;
            info.errorMessage = "Invalid API Key: The key provided is not recognized by Supabase.";
          } else if (error.message?.includes('Failed to fetch')) {
            info.isUrlReachable = false;
            info.errorMessage = "Failed to Fetch: Connection was blocked mid-request.";
          } else if (error.message?.includes('relation "deals" does not exist')) {
            info.isApiKeyValid = true;
            info.areTablesReady = false;
            info.errorMessage = "Tables Missing: You need to run the SQL script in Supabase.";
          } else {
            info.errorMessage = error.message;
          }
          setDiagnosticInfo(info);
          setConnectionStatus('error');
          return;
        }
        
        info.isApiKeyValid = true;
        info.areTablesReady = true;
        setConnectionStatus('connected');
      } catch (e) {
        info.errorMessage = "Unexpected Error during diagnostic.";
        setConnectionStatus('error');
      }
    } finally {
      setDiagnosticInfo(info);
    }
  };

  const fetchDeals = async () => {
    setIsLoading(true);
    try {
      await runDiagnostic();
      const deals = await apiService.deals.getAll();
      const grouped: Record<string, Deal[]> = {};
      DEAL_STAGES.forEach(stage => {
        grouped[stage] = deals.filter(d => d.stage === stage);
      });
      setGroupedDeals(grouped);
    } catch (error) {
      console.error('Failed to fetch deals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const totalRevenue = useMemo(() => {
    return Object.values(groupedDeals).flat().reduce((sum, d) => sum + d.value, 0);
  }, [groupedDeals]);

  const monthlyRevenue = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    
    const data = months.map(month => ({ name: month, value: 0 }));
    
    const STAGE_WEIGHTS: Record<string, number> = {
      'New': 0.1,
      'Proposal Sent': 0.3,
      'Negotiation': 0.6,
      'Closed Won': 1.0,
      'Closed Lost': 0
    };
    
    Object.values(groupedDeals).flat().forEach(deal => {
      const date = new Date(deal.expectedClose);
      if (date.getFullYear() === currentYear) {
        const monthIndex = date.getMonth();
        const weight = STAGE_WEIGHTS[deal.stage] || 0;
        data[monthIndex].value += Math.round(deal.value * weight);
      }
    });
    
    // Return all 12 months for the chart
    return data; 
  }, [groupedDeals]);

  return (
    <AppContext.Provider value={{ 
      groupedDeals, 
      setGroupedDeals, 
      totalRevenue, 
      monthlyRevenue,
      isLoading,
      connectionStatus,
      diagnosticInfo,
      refreshDeals: fetchDeals,
      runDiagnostic
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
