import { motion } from 'framer-motion';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Topbar } from '@/components/layout/Topbar';
import { GlassCard } from '@/components/ui/GlassCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Presentation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Presentations() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-dark">
      <AppSidebar />
      <Topbar />
      
      <main className="ml-20 mt-20 p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-10">
              <motion.h1 
                className="text-4xl font-bold text-white mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                Presentations
              </motion.h1>
              <motion.p 
                className="text-gray-400 text-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Manage all your AI-generated presentations
              </motion.p>
            </div>

            <GlassCard className="p-16">
              <EmptyState
                icon={<Presentation className="w-20 h-20" />}
                title="No presentations yet"
                description="Create your first presentation with AI assistance and impress your audience!"
                actionLabel="Create Presentation"
                onAction={() => navigate('/create')}
              />
            </GlassCard>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
