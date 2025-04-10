import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dashboard, Widget, UserSettings, ConnectedService } from '@/types/dashboard';

interface DashboardState {
  dashboards: Dashboard[];
  activeDashboardId: string | null;
  userSettings: UserSettings;
  isFirstLaunch: boolean;
  
  // Actions
  addDashboard: (name: string) => void;
  removeDashboard: (id: string) => void;
  renameDashboard: (id: string, name: string) => void;
  setActiveDashboard: (id: string) => void;
  
  addWidget: (dashboardId: string, widget: Omit<Widget, "id" | "position">) => void;
  updateWidget: (dashboardId: string, widgetId: string, updates: Partial<Widget>) => void;
  removeWidget: (dashboardId: string, widgetId: string) => void;
  reorderWidgets: (dashboardId: string, orderedWidgetIds: string[]) => void;
  
  updateUserSettings: (settings: Partial<UserSettings>) => void;
  setFirstLaunchComplete: () => void;
  
  // Connected services
  addConnectedService: (service: ConnectedService) => void;
  removeConnectedService: (serviceId: string) => void;
  updateConnectedService: (serviceId: string, updates: Partial<ConnectedService>) => void;
}

// Create a default dashboard
const createDefaultDashboard = (): Dashboard => ({
  id: "default",
  name: "My Dashboard",
  widgets: [
    {
      id: "clock-1",
      type: "clock",
      title: "Clock",
      position: 0,
      size: "small",
    },
    {
      id: "weather-1",
      type: "weather",
      title: "Weather",
      position: 1,
      size: "medium",
      settings: {
        location: "auto",
        unit: "celsius"
      }
    },
    {
      id: "news-1",
      type: "news",
      title: "Latest News",
      position: 2,
      size: "large",
      settings: {
        sources: ["bbc-news", "cnn", "the-verge"],
        categories: ["technology", "business"],
        refreshInterval: 30 // minutes
      }
    },
    {
      id: "tasks-1",
      type: "tasks",
      title: "Tasks",
      position: 3,
      size: "medium",
    }
  ]
});

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      dashboards: [createDefaultDashboard()],
      activeDashboardId: "default",
      userSettings: {
        theme: "light",
        defaultDashboard: "default",
        connectedServices: []
      },
      isFirstLaunch: true,
      
      addDashboard: (name) => {
        const newDashboard: Dashboard = {
          id: Date.now().toString(),
          name,
          widgets: []
        };
        
        set((state) => ({
          dashboards: [...state.dashboards, newDashboard]
        }));
      },
      
      removeDashboard: (id) => {
        set((state) => ({
          dashboards: state.dashboards.filter(d => d.id !== id),
          activeDashboardId: state.activeDashboardId === id 
            ? (state.dashboards.length > 1 
                ? state.dashboards.find(d => d.id !== id)?.id || null 
                : null)
            : state.activeDashboardId
        }));
      },
      
      renameDashboard: (id, name) => {
        set((state) => ({
          dashboards: state.dashboards.map(d => 
            d.id === id ? { ...d, name } : d
          )
        }));
      },
      
      setActiveDashboard: (id) => {
        set({ activeDashboardId: id });
      },
      
      addWidget: (dashboardId, widget) => {
        set((state) => {
          const dashboard = state.dashboards.find(d => d.id === dashboardId);
          if (!dashboard) return state;
          
          const position = dashboard.widgets.length;
          const newWidget: Widget = {
            ...widget,
            id: `${widget.type}-${Date.now()}`,
            position
          };
          
          return {
            dashboards: state.dashboards.map(d => 
              d.id === dashboardId 
                ? { ...d, widgets: [...d.widgets, newWidget] }
                : d
            )
          };
        });
      },
      
      updateWidget: (dashboardId, widgetId, updates) => {
        set((state) => ({
          dashboards: state.dashboards.map(d => 
            d.id === dashboardId 
              ? {
                  ...d,
                  widgets: d.widgets.map(w => 
                    w.id === widgetId ? { ...w, ...updates } : w
                  )
                }
              : d
          )
        }));
      },
      
      removeWidget: (dashboardId, widgetId) => {
        set((state) => ({
          dashboards: state.dashboards.map(d => 
            d.id === dashboardId 
              ? {
                  ...d,
                  widgets: d.widgets
                    .filter(w => w.id !== widgetId)
                    .map((w, index) => ({ ...w, position: index }))
                }
              : d
          )
        }));
      },
      
      reorderWidgets: (dashboardId, orderedWidgetIds) => {
        set((state) => ({
          dashboards: state.dashboards.map(d => 
            d.id === dashboardId 
              ? {
                  ...d,
                  widgets: orderedWidgetIds.map((id, index) => {
                    const widget = d.widgets.find(w => w.id === id);
                    return widget ? { ...widget, position: index } : widget!;
                  }).filter(Boolean)
                }
              : d
          )
        }));
      },
      
      updateUserSettings: (settings) => {
        set((state) => ({
          userSettings: { ...state.userSettings, ...settings }
        }));
      },
      
      setFirstLaunchComplete: () => {
        set({ isFirstLaunch: false });
      },
      
      addConnectedService: (service) => {
        set((state) => ({
          userSettings: {
            ...state.userSettings,
            connectedServices: [...state.userSettings.connectedServices, service]
          }
        }));
      },
      
      removeConnectedService: (serviceId) => {
        set((state) => ({
          userSettings: {
            ...state.userSettings,
            connectedServices: state.userSettings.connectedServices.filter(
              service => service.id !== serviceId
            )
          }
        }));
      },
      
      updateConnectedService: (serviceId, updates) => {
        set((state) => ({
          userSettings: {
            ...state.userSettings,
            connectedServices: state.userSettings.connectedServices.map(
              service => service.id === serviceId 
                ? { ...service, ...updates }
                : service
            )
          }
        }));
      }
    }),
    {
      name: 'dashboard-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);