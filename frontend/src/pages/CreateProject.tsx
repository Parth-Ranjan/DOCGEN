import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectStore } from '@/store/projectStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { AnimatedInput } from '@/components/ui/AnimatedInput';
import { GlowButton } from '@/components/ui/GlowButton';
import { FileText, Presentation, Plus, Trash2, ArrowLeft, Sparkles, Zap } from 'lucide-react';
import axiosClient from '@/lib/axiosClient';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Topbar } from '@/components/layout/Topbar';

export default function CreateProject() {
  const navigate = useNavigate();
  const createProject = useProjectStore((state) => state.createProject);
  
  const [step, setStep] = useState(1);
  const [documentType, setDocumentType] = useState<'docx' | 'pptx' | null>(null);
  const [title, setTitle] = useState('');
  const [mainTopic, setMainTopic] = useState('');
  const [sections, setSections] = useState<{ title: string; order: number }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);

  const addSection = () => {
    setSections([...sections, { title: '', order: sections.length }]);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const updateSection = (index: number, title: string) => {
    const updated = [...sections];
    updated[index] = { ...updated[index], title };
    setSections(updated);
  };

  const handleAIOutline = async () => {
    if (!mainTopic || !documentType) return;
    
    setIsGeneratingOutline(true);
    try {
      const response = await axiosClient.post('/generate/outline', {
        main_topic: mainTopic,
        document_type: documentType,
        num_sections: 5
      });
      
      const titles = response.data.titles;
      setSections(titles.map((title: string, index: number) => ({
        title,
        order: index
      })));
    } catch (error) {
      console.error('Failed to generate outline:', error);
    } finally {
      setIsGeneratingOutline(false);
    }
  };

  const handleSubmit = async () => {
    if (!documentType || !title || !mainTopic || sections.length === 0) {
      alert('Please fill in all fields and add at least one section');
      return;
    }

    setIsLoading(true);
    try {
      const project = await createProject({
        title,
        document_type: documentType,
        main_topic: mainTopic,
        sections: sections.map((s, i) => ({ ...s, order: i }))
      });
      
      navigate(`/project/${project.id}`);
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Failed to create project');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <AppSidebar />
      <Topbar />

      <main className="ml-20 mt-20 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group"
              whileHover={{ x: -5 }}
            >
              <ArrowLeft className="w-5 h-5 group-hover:text-primary transition-colors" />
              <span>Back to Dashboard</span>
            </motion.button>

            <h1 className="text-4xl font-bold text-white mb-3">Create New Project</h1>
            <p className="text-gray-400 text-lg">Configure your document and let AI generate amazing content</p>
          </motion.div>

          <AnimatePresence mode="wait">
            {/* Step 1: Choose Document Type */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard className="p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">Choose Document Type</h2>
                    <p className="text-gray-400">Select the type of document you want to create</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Word Document Card */}
                    <motion.button
                      onClick={() => {
                        setDocumentType('docx');
                        setStep(2);
                      }}
                      className="group relative p-8 glass-card border-2 border-glass-border rounded-2xl hover:border-primary/50 transition-all duration-300 text-left overflow-hidden"
                      whileHover={{ scale: 1.02, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Gradient Background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="relative z-10">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/50 transition-shadow duration-300">
                          <FileText className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Word Document</h3>
                        <p className="text-gray-400 leading-relaxed">Create a professional .docx document with AI-generated sections and content</p>
                      </div>
                    </motion.button>

                    {/* PowerPoint Card */}
                    <motion.button
                      onClick={() => {
                        setDocumentType('pptx');
                        setStep(2);
                      }}
                      className="group relative p-8 glass-card border-2 border-glass-border rounded-2xl hover:border-accent/50 transition-all duration-300 text-left overflow-hidden"
                      whileHover={{ scale: 1.02, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Gradient Background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="relative z-10">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-orange-500/25 group-hover:shadow-orange-500/50 transition-shadow duration-300">
                          <Presentation className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">PowerPoint Presentation</h3>
                        <p className="text-gray-400 leading-relaxed">Create a professional .pptx presentation with AI-generated slides</p>
                      </div>
                    </motion.button>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* Step 2: Project Configuration */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Project Details */}
                <GlassCard className="p-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Project Details</h2>
                    <p className="text-gray-400">Provide basic information about your document</p>
                  </div>

                  <div className="space-y-5">
                    <AnimatedInput
                      label="Project Title"
                      placeholder="e.g., Q4 Business Report"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />

                    <AnimatedInput
                      label="Main Topic"
                      placeholder="e.g., Market analysis of the EV industry in 2025"
                      value={mainTopic}
                      onChange={(e) => setMainTopic(e.target.value)}
                    />
                  </div>
                </GlassCard>

                {/* Outline/Sections */}
                <GlassCard className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">
                        {documentType === 'docx' ? 'Document Outline' : 'Slide Titles'}
                      </h2>
                      <p className="text-gray-400">
                        {documentType === 'docx' 
                          ? 'Define the sections for your document'
                          : 'Define the titles for your slides'}
                      </p>
                    </div>
                    <motion.button
                      onClick={handleAIOutline}
                      disabled={!mainTopic || isGeneratingOutline}
                      className="flex items-center gap-2 px-5 py-3 glass-card border border-primary/30 rounded-xl text-primary hover:bg-primary/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isGeneratingOutline ? (
                        <>
                          <motion.div
                            className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          <span>AI Suggest</span>
                        </>
                      )}
                    </motion.button>
                  </div>

                  <div className="space-y-4">
                    <AnimatePresence>
                      {sections.map((section, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="flex items-center gap-3"
                        >
                          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-xl text-primary font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <AnimatedInput
                              placeholder={documentType === 'docx' ? 'Section title' : 'Slide title'}
                              value={section.title}
                              onChange={(e) => updateSection(index, e.target.value)}
                            />
                          </div>
                          <motion.button
                            onClick={() => removeSection(index)}
                            className="p-3 rounded-xl hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 className="w-5 h-5" />
                          </motion.button>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    <motion.button
                      onClick={addSection}
                      className="w-full p-4 glass-card border-2 border-dashed border-glass-border rounded-xl hover:border-primary/50 hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-2 text-gray-400 hover:text-white"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Plus className="w-5 h-5" />
                      <span>Add {documentType === 'docx' ? 'Section' : 'Slide'}</span>
                    </motion.button>
                  </div>
                </GlassCard>

                {/* Action Buttons */}
                <div className="flex items-center justify-between gap-4">
                  <motion.button
                    onClick={() => setStep(1)}
                    className="px-6 py-3 glass-card border border-glass-border rounded-xl text-white hover:bg-white/5 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Back
                  </motion.button>
                  <GlowButton
                    onClick={handleSubmit}
                    disabled={isLoading || !title || !mainTopic || sections.length === 0}
                    className="flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <motion.div
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        <span>Create Project</span>
                      </>
                    )}
                  </GlowButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
