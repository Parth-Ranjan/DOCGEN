import { motion } from 'framer-motion';
import { 
  Home, 
  FileText, 
  Presentation, 
  Settings, 
  User,
  Sparkles,
  History
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const sidebarItems = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: FileText, label: 'Documents', path: '/documents' },
  { icon: Presentation, label: 'Presentations', path: '/presentations' },
  { icon: History, label: 'Recent', path: '/recent' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <motion.div
      className="fixed left-0 top-0 h-full w-20 glass-card border-r border-glass-border z-50"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center h-20 border-b border-glass-border">
          <motion.div
            className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 cursor-pointer"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/dashboard')}
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-8">
          <div className="space-y-2 px-3">
            {sidebarItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <motion.button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    'relative w-full h-14 flex items-center justify-center rounded-2xl transition-all duration-300 group',
                    isActive 
                      ? 'bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/25' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <item.icon className="w-6 h-6" />
                  
                  {/* Tooltip */}
                  <div className="absolute left-full ml-4 px-3 py-2 bg-dark-200 text-white text-sm rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
                    {item.label}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-3 border-t border-glass-border">
          <motion.button
            className="w-full h-14 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center text-white hover:from-gray-600 hover:to-gray-800 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <User className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
