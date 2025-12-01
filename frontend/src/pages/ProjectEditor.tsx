import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectStore } from '@/store/projectStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlowButton } from '@/components/ui/GlowButton';
import { AnimatedInput } from '@/components/ui/AnimatedInput';
import { ArrowLeft, Download, Sparkles, Wand2, FileText, Presentation, Check } from 'lucide-react';
import axiosClient from '@/lib/axiosClient';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Topbar } from '@/components/layout/Topbar';

export default function ProjectEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentProject, fetchProject, updateSection } = useProjectStore();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [refinementPrompt, setRefinementPrompt] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProject(parseInt(id));
    }
  }, [id, fetchProject]);

  const handleGenerateContent = async () => {
    if (!currentProject) return;
    
    setIsGenerating(true);
    setGenerationProgress(0);
    
    try {
      const totalSections = currentProject.sections.length;
      const progressIncrement = 100 / totalSections;
      
      await axiosClient.post('/generate/content', {
        project_id: currentProject.id
      });
      
      // Simulate progress
      for (let i = 0; i <= totalSections; i++) {
        setGenerationProgress(Math.min(i * progressIncrement, 100));
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      await fetchProject(currentProject.id);
    } catch (error) {
      console.error('Failed to generate content:', error);
      alert('Failed to generate content');
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const handleRefine = async (sectionId: number) => {
    if (!refinementPrompt.trim()) return;
    
    setIsRefining(true);
    try {
      await axiosClient.post('/refine', {
        section_id: sectionId,
        prompt: refinementPrompt
      });
      
      if (currentProject) {
        await fetchProject(currentProject.id);
      }
      setRefinementPrompt('');
      setSelectedSection(null);
    } catch (error) {
      console.error('Failed to refine content:', error);
      alert('Failed to refine content');
    } finally {
      setIsRefining(false);
    }
  };

  const handleContentChange = async (sectionId: number, content: string) => {
    try {
      await updateSection(sectionId, { content });
    } catch (error) {
      console.error('Failed to update content:', error);
    }
  };

  const handleExport = async () => {
    if (!currentProject) return;
    
    setIsExporting(true);
    try {
      const endpoint = currentProject.document_type === 'docx' 
        ? `/export/${currentProject.id}/docx`
        : `/export/${currentProject.id}/pptx`;
      
      const response = await axiosClient.get(endpoint, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${currentProject.title}.${currentProject.document_type}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to export:', error);
      alert('Failed to export document');
    } finally {
      setIsExporting(false);
    }
  };

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <motion.div
          className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  const hasContent = currentProject.sections.some(s => s.content);
  const DocIcon = currentProject.document_type === 'docx' ? FileText : Presentation;

  return (
    <div className="min-h-screen bg-gradient-dark">
      <AppSidebar />
      <Topbar />

      <main className="ml-20 mt-20 p-8">
        <div className="max-w-6xl mx-auto">
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

            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${
                  currentProject.document_type === 'docx' 
                    ? 'from-blue-500 to-cyan-500' 
                    : 'from-orange-500 to-pink-500'
                } flex items-center justify-center shadow-lg`}>
                  <DocIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">{currentProject.title}</h1>
                  <p className="text-gray-400 text-lg">{currentProject.main_topic}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="px-3 py-1 bg-primary/20 text-primary rounded-lg text-sm font-medium">
                      {currentProject.sections.length} {currentProject.document_type === 'docx' ? 'Sections' : 'Slides'}
                    </span>
                    {hasContent && (
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        Content Generated
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {!hasContent && (
                  <GlowButton
                    onClick={handleGenerateContent}
                    disabled={isGenerating}
                    className="flex items-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <motion.div
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <span>Generating... {Math.round(generationProgress)}%</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>Generate Content</span>
                      </>
                    )}
                  </GlowButton>
                )}
                {hasContent && (
                  <GlowButton
                    onClick={handleExport}
                    disabled={isExporting}
                    className="flex items-center gap-2"
                  >
                    {isExporting ? (
                      <>
                        <motion.div
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <span>Exporting...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        <span>Export {currentProject.document_type.toUpperCase()}</span>
                      </>
                    )}
                  </GlowButton>
                )}
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {!hasContent ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <GlassCard className="p-16">
                  <div className="flex flex-col items-center justify-center text-center">
                    <motion.div
                      className="w-28 h-28 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl flex items-center justify-center mb-8 relative"
                      animate={{ 
                        scale: [1, 1.05, 1],
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-xl" />
                      <Sparkles className="w-14 h-14 text-primary relative z-10" />
                    </motion.div>
                    <h3 className="text-3xl font-bold text-white mb-4">Ready to Generate Content</h3>
                    <p className="text-gray-400 text-lg mb-8 max-w-2xl">
                      Click the "Generate Content" button above to let AI create professional, 
                      well-structured content for all your {currentProject.document_type === 'docx' ? 'sections' : 'slides'}
                    </p>
                    {isGenerating && (
                      <div className="w-full max-w-md">
                        <div className="h-2 bg-dark-300 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-primary to-accent"
                            initial={{ width: 0 }}
                            animate={{ width: `${generationProgress}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        <p className="text-gray-400 text-sm mt-3">Generating amazing content...</p>
                      </div>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {currentProject.sections
                  .sort((a, b) => a.order - b.order)
                  .map((section, index) => (
                    <motion.div
                      key={section.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <GlassCard className="p-8">
                        {/* Section Header */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                              {section.order + 1}
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-white">{section.title}</h3>
                              <p className="text-gray-400 text-sm">
                                {currentProject.document_type === 'docx' ? 'Section' : 'Slide'} {section.order + 1}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Content Editor */}
                        <div className="mb-6">
                          <div className="rounded-xl overflow-hidden border border-glass-border">
                            <ReactQuill
                              theme="snow"
                              value={section.content}
                              onChange={(content) => handleContentChange(section.id, content)}
                              className="bg-dark-300/50"
                              modules={{
                                toolbar: [
                                  [{ 'header': [1, 2, 3, false] }],
                                  ['bold', 'italic', 'underline'],
                                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                  ['clean']
                                ]
                              }}
                            />
                          </div>
                        </div>

                        {/* AI Refinement */}
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <AnimatedInput
                              placeholder="Ask AI to refine (e.g., 'Make it more formal' or 'Add more details')"
                              value={selectedSection === section.id ? refinementPrompt : ''}
                              onChange={(e) => {
                                setSelectedSection(section.id);
                                setRefinementPrompt(e.target.value);
                              }}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter' && refinementPrompt.trim()) {
                                  handleRefine(section.id);
                                }
                              }}
                              icon={<Wand2 className="w-5 h-5" />}
                            />
                          </div>
                          <motion.button
                            onClick={() => handleRefine(section.id)}
                            disabled={isRefining || !refinementPrompt.trim() || selectedSection !== section.id}
                            className="px-6 py-3.5 glass-card border border-primary/30 rounded-xl text-primary hover:bg-primary/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {isRefining && selectedSection === section.id ? (
                              <>
                                <motion.div
                                  className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full"
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                                <span>Refining...</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-5 h-5" />
                                <span>Refine</span>
                              </>
                            )}
                          </motion.button>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
