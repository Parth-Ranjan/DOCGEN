import { motion } from 'framer-motion';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Topbar } from '@/components/layout/Topbar';
import { GlassCard } from '@/components/ui/GlassCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { FileText, Presentation, TrendingUp, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  const stats = [
    { label: 'Documents', value: '0', icon: FileText, gradient: 'from-blue-500 to-cyan-500' },
    { label: 'Presentations', value: '0', icon: Presentation, gradient: 'from-purple-500 to-pink-500' },
    { label: 'This Week', value: '0', icon: TrendingUp, gradient: 'from-green-500 to-emerald-500' },
    { label: 'Recent', value: '0', icon: Clock, gradient: 'from-orange-500 to-amber-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-dark">
      <AppSidebar />
      <Topbar />
      
      <main className="ml-20 mt-20 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          {/* Welcome Section */}
          <div className="mb-10">
            <motion.h1 
              className="text-4xl font-bold text-white mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              Welcome back 👋
            </motion.h1>
            <motion.p 
              className="text-gray-400 text-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Ready to create something amazing today?
            </motion.p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <GlassCard className="p-6 hover:bg-white/5 transition-all duration-300 cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm font-medium mb-2">{stat.label}</p>
                      <p className="text-4xl font-bold text-white">{stat.value}</p>
                    </div>
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard className="p-16">
              <EmptyState
                icon={<FileText className="w-20 h-20" />}
                title="No documents yet"
                description="Start creating your first document with AI assistance. It only takes a few seconds!"
                actionLabel="Create Your First Document"
                onAction={() => navigate('/create')}
              />
            </GlassCard>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
