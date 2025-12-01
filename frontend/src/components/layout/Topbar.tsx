import { motion } from 'framer-motion';
import { Search, Bell, User, Plus } from 'lucide-react';
import { AnimatedInput } from '@/components/ui/AnimatedInput';
import { GlowButton } from '@/components/ui/GlowButton';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export function Topbar() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  return (
    <motion.header
      className="fixed top-0 left-20 right-0 h-20 glass-card border-b border-glass-border z-40"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center justify-between h-full px-8">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <AnimatedInput
            placeholder="Search documents..."
            icon={<Search className="w-5 h-5" />}
            className="bg-dark-300/50 border-0"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Create Button */}
          <GlowButton
            onClick={() => navigate('/create')}
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Create</span>
          </GlowButton>

          {/* Notifications */}
          <motion.button
            className="relative p-3 rounded-xl hover:bg-white/5 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell className="w-6 h-6 text-gray-400" />
            <div className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full animate-pulse" />
          </motion.button>

          {/* User Menu */}
          <motion.button
            className="flex items-center gap-3 p-2 pr-4 rounded-xl hover:bg-white/5 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="text-left hidden md:block">
              <div className="text-sm font-medium text-white">{user?.username || 'User'}</div>
              <div className="text-xs text-gray-400">Pro Plan</div>
            </div>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
