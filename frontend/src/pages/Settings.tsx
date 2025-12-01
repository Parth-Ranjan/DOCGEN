import { motion } from 'framer-motion';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Topbar } from '@/components/layout/Topbar';
import { GlassCard } from '@/components/ui/GlassCard';
import { Settings as SettingsIcon, User, Bell, Shield, Palette } from 'lucide-react';

export default function Settings() {
  const settingsSections = [
    { icon: User, title: 'Profile', description: 'Manage your account settings' },
    { icon: Bell, title: 'Notifications', description: 'Configure notification preferences' },
    { icon: Shield, title: 'Privacy', description: 'Control your privacy settings' },
    { icon: Palette, title: 'Appearance', description: 'Customize your experience' },
  ];

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
                Settings
              </motion.h1>
              <motion.p 
                className="text-gray-400 text-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Manage your account and preferences
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {settingsSections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <GlassCard className="p-6 hover:bg-white/5 transition-all duration-300 cursor-pointer group">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <section.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">{section.title}</h3>
                        <p className="text-gray-400 text-sm">{section.description}</p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <GlassCard className="p-12">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center mb-6">
                    <SettingsIcon className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Settings Coming Soon</h3>
                  <p className="text-gray-400 text-lg max-w-md">
                    We're working on bringing you more customization options. Stay tuned!
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
