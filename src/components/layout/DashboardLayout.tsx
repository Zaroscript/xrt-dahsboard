import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '@/store/store';
import { toggleTheme } from '@/store/slices/dashboardSlice';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ThemeProvider } from 'next-themes';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const dispatch = useAppDispatch();
  const theme = useAppSelector(state => state.dashboard.theme);
  const isMobile = useIsMobile();

  // Force collapsed state on mobile
  const effectiveCollapsed = isMobile || sidebarCollapsed;

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <ThemeProvider attribute="class" defaultTheme={theme} forcedTheme={theme}>
      <div className={`min-h-screen bg-background ${theme}`}>
        <div className="flex h-screen overflow-hidden">
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`${effectiveCollapsed ? 'w-20' : 'w-72'} transition-all duration-300 flex-shrink-0`}
          >
            <Sidebar 
              collapsed={effectiveCollapsed} 
              onToggle={() => !isMobile && setSidebarCollapsed(!sidebarCollapsed)} 
            />
          </motion.div>
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header 
              onThemeToggle={handleThemeToggle} 
              theme={theme}
              sidebarCollapsed={effectiveCollapsed}
              onSidebarToggle={() => !isMobile && setSidebarCollapsed(!sidebarCollapsed)}
            />
            
            <main className="flex-1 overflow-y-auto bg-background p-6 relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-7xl mx-auto"
              >
                {children}
              </motion.div>
            </main>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};